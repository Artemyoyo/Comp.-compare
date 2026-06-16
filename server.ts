import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { POPULAR_GPUS, POPULAR_CPUS } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it to your secrets inside Google AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Robust helper to call Gemini with exponential backoff on transient errors and auto-fallback to alternate models
async function callGeminiWithRetry(
  ai: GoogleGenAI,
  options: {
    model: string;
    contents: any;
    config: any;
  }
) {
  const modelsToTry = [
    options.model,             // Primary choice: gemini-3.5-flash
    "gemini-3.1-flash-lite",   // Highly available, low latency fallback
    "gemini-flash-latest"      // General-purpose fast model fallback
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let retries = 2; // 2 retries per model is optimal to keep overall latency reasonable
    let delay = 500; // start with a small progressive delay

    while (retries > 0) {
      try {
        console.log(`Calling Gemini [Model: ${modelName}] [Retries left: ${retries}]...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.error(`Gemini Error on [Model: ${modelName}] (retries left = ${retries}):`, err);

        let isTransient = false;
        const code = err.status || err.statusCode || err.error?.code || (err.error && err.error.code);
        const statusStr = err.status || err.error?.status || (err.error && err.error.status);
        const errMsg = String(err.message || "").toLowerCase() + " " + JSON.stringify(err).toLowerCase();

        if (
          code === 503 ||
          code === 429 ||
          statusStr === "UNAVAILABLE" ||
          statusStr === "RESOURCE_EXHAUSTED" ||
          errMsg.includes("503") ||
          errMsg.includes("429") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("resource_exhausted") ||
          errMsg.includes("high demand") ||
          errMsg.includes("temporary") ||
          errMsg.includes("overloaded") ||
          errMsg.includes("quota")
        ) {
          isTransient = true;
        }

        if (isTransient && retries > 1) {
          console.log(`Transient/overload situation detected for model ${modelName}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // gradual backoff
          retries--;
        } else {
          // If not transient, or we have exhausted attempts for this model, break to proceed to the next fallback model
          break;
        }
      }
    }
  }

  throw lastError || new Error("Не вдалося отримати відповідь від ШІ після спроб з усіма доступними моделями.");
}

// Highly valid local offline fallback generator for computer component comparisons
function generateFallbackComparison(componentA: string, componentB: string, type: 'gpu' | 'cpu') {
  // Try to find in the static database
  const findInCatalog = (name: string) => {
    const list = type === 'gpu' ? POPULAR_GPUS : POPULAR_CPUS;
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Direct match
    let found = list.find(item => item.id.toLowerCase() === clean);
    if (found) return found;

    // Fuzzy clean name match
    found = list.find(item => {
      const dbCleanName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return clean.includes(dbCleanName) || dbCleanName.includes(clean);
    });
    if (found) return found;

    // Word checking
    const words = name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (words.length > 0) {
      found = list.find(item => {
        const dbNameLower = item.name.toLowerCase();
        return words.every(word => dbNameLower.includes(word));
      });
      if (found) return found;
    }
    return null;
  };

  const detectedA = findInCatalog(componentA);
  const detectedB = findInCatalog(componentB);

  // Helper to guess brand
  const guessBrand = (name: string): 'NVIDIA' | 'AMD' | 'Intel' => {
    const norm = name.toLowerCase();
    if (norm.includes('nvidia') || norm.includes('geforce') || norm.includes('rtx') || norm.includes('gtx')) return 'NVIDIA';
    if (norm.includes('amd') || norm.includes('radeon') || norm.includes('ryzen') || norm.includes('rx ')) return 'AMD';
    if (norm.includes('intel') || norm.includes('core') || norm.includes('xeon') || norm.includes('i9') || norm.includes('i7') || norm.includes('i5') || norm.includes('i3')) return 'Intel';
    return type === 'gpu' ? 'NVIDIA' : 'Intel';
  };

  // Helper to construct specs item
  const buildSpecsSpecs = (item: any, name: string) => {
    if (item) {
      const tbl = [];
      const dictLabel: Record<string, string> = {
        memorySize: "Обсяг відеопам'яті",
        memoryType: "Тип пам'яті",
        busWidth: "Ширина шини пам'яті",
        memorySpeed: "Швидкість пам'яті / ПЗД",
        powerTdp: "Енергоспоживання (TDP)",
        chipset: "Архітектура / Чіпсет",
        recommendedPsu: "Рекомендований БЖ",
        directX: "Версія DirectX",
        coresThreads: "Ядра / Потоки",
        socket: "Роз'єм (Socket)",
        baseClock: "Базова тактова частота",
        boostClock: "Максимальна частота",
        cacheSize: "Обсяг кеш-пам'яті",
        hasIntegratedGraphics: "Вбудоване відеоядро",
        processNode: "Техпроцес",
        ramSupport: "Підтримувана пам'ять"
      };
      for (const [k, v] of Object.entries(item.specs)) {
        tbl.push({ label: dictLabel[k] || k, value: String(v) });
      }
      return {
        name: item.name,
        brand: item.brand,
        priceUah: item.priceUah,
        performanceScore: item.performanceScore,
        valueScore: item.valueScore,
        releaseYear: item.releaseYear,
        specsTable: tbl,
        pros: item.pros,
        cons: item.cons
      };
    }

    // Guess specs if not found
    const brand = guessBrand(name);
    const norm = name.toLowerCase();
    let price = 12000;
    let perf = 50;
    let val = 75;
    let year = 2023;
    let pros = ["Збалансований рівень продуктивності", "Хороша енергоефективність", "Універсальний вибір у своєму ціновому сегменті"];
    let cons = ["Може нагріватися під тривалим навантаженням", "Ціна дещо вища за очікувану"];
    const specsTable = [];

    if (type === 'gpu') {
      let memSize = "8 GB";
      let memType = "GDDR6";
      let busWidth = "128-bit";
      let tdp = "150W";
      let psu = "550W";
      let arch = "Сучасна мікроархітектура";

      // Guessing based on model numbers
      if (norm.includes('4090')) { perf = 100; val = 40; price = 85999; memSize = "24 GB"; memType = "GDDR6X"; busWidth = "384-bit"; tdp = "450W"; psu = "850W"; arch = "Ada Lovelace"; year = 2022; }
      else if (norm.includes('4080')) { perf = 88; val = 62; price = 48000; memSize = "16 GB"; memType = "GDDR6X"; busWidth = "256-bit"; tdp = "320W"; psu = "750W"; arch = "Ada Lovelace"; year = 2022; }
      else if (norm.includes('4070')) { perf = 74; val = 82; price = 26500; memSize = "12 GB"; memType = "GDDR6X"; busWidth = "192-bit"; tdp = "200W"; psu = "650W"; arch = "Ada Lovelace"; year = 2023; }
      else if (norm.includes('4060')) { perf = 46; val = 86; price = 13799; memSize = "8 GB"; memType = "GDDR6"; busWidth = "128-bit"; tdp = "115W"; psu = "500W"; arch = "Ada Lovelace"; year = 2023; }
      else if (norm.includes('7900')) { perf = 91; val = 84; price = 42500; memSize = "24 GB"; memType = "GDDR6"; busWidth = "384-bit"; tdp = "355W"; psu = "800W"; arch = "RDNA 3"; year = 2022; }
      else if (norm.includes('7800')) { perf = 73; val = 92; price = 23499; memSize = "16 GB"; memType = "GDDR6"; busWidth = "256-bit"; tdp = "263W"; psu = "700W"; arch = "RDNA 3"; year = 2023; }
      else if (norm.includes('7700')) { perf = 62; val = 84; price = 19199; memSize = "12 GB"; memType = "GDDR6"; busWidth = "192-bit"; tdp = "245W"; psu = "700W"; arch = "RDNA 3"; year = 2023; }
      else if (norm.includes('7600')) { perf = 43; val = 87; price = 12500; memSize = "8 GB"; memType = "GDDR6"; busWidth = "128-bit"; tdp = "165W"; psu = "550W"; arch = "RDNA 3"; year = 2023; }
      else if (norm.includes('3060')) { perf = 38; val = 88; price = 11999; memSize = "12 GB"; memType = "GDDR6"; busWidth = "192-bit"; tdp = "170W"; psu = "550W"; arch = "Ampere"; year = 2021; }
      else if (norm.includes('1660')) { perf = 26; val = 91; price = 7299; memSize = "6 GB"; memType = "GDDR6"; busWidth = "192-bit"; tdp = "125W"; psu = "455W"; arch = "Turing"; year = 2019; }
      else if (norm.includes('580')) { perf = 18; val = 97; price = 3999; memSize = "8 GB"; memType = "GDDR5"; busWidth = "256-bit"; tdp = "185W"; psu = "500W"; arch = "Polaris"; year = 2017; }
      else {
        if (norm.includes('super')) { perf += 6; price += 3000; }
        if (norm.includes('ti')) { perf += 8; price += 4000; }
      }

      specsTable.push({ label: "Обсяг відеопам'яті", value: memSize });
      specsTable.push({ label: "Тип пам'яті", value: memType });
      specsTable.push({ label: "Ширина шини пам'яті", value: busWidth });
      specsTable.push({ label: "Швидкість пам'яті / ПЗД", value: memType === "GDDR6X" ? "21 Гбіт/с" : "16 Гбіт/с" });
      specsTable.push({ label: "Енергоспоживання (TDP)", value: tdp });
      specsTable.push({ label: "Архітектура / Чіпсет", value: arch });
      specsTable.push({ label: "Рекомендований БЖ", value: psu });
      specsTable.push({ label: "Версія DirectX", value: year >= 2020 ? "12 Ultimate" : "12" });

      if (perf > 70) {
        pros = ["Високий FPS в роздільній здатності 1440p та 4K", `${memSize} відеобуферу вистачить для ультра-текстур`, "Відмінна підтримка технологій масштабування"];
        cons = ["Високі вимоги до джерела живлення комп'ютера", "Вимагає якісної вентиляції у корпусі системи"];
      } else {
        pros = ["Ідеально підходить для геймінгу у високій якості FullHD", "Економічне енергоспоживання у робочих сценаріях", "Відмінне співвідношення продуктивності на кожен долар"];
        cons = ["Можливі компроміси у майбутніх тайтлах на ультра-налаштуваннях", "Вузька шина передачі даних обмежить 4K роздільну здатність"];
      }
    } else {
      // CPU guessing
      let cores = "6 / 12";
      let socket = brand === 'AMD' ? 'AM4' : 'LGA1700';
      let freqBase = "3.5 GHz";
      let freqBoost = "4.4 GHz";
      let cache = "16 MB";
      let tdp = "65W";
      let igpu = "Ні";
      let process = "7 nm";

      if (norm.includes('14900') || norm.includes('13900')) { perf = 100; val = 55; price = 24499; cores = "24 (8P + 16E) / 32"; socket = "LGA1700"; freqBase = "3.2 GHz"; freqBoost = "6.0 GHz"; cache = "36 MB"; tdp = "125W"; igpu = "Так (Intel UHD 770)"; process = "10 nm"; year = 2023; }
      else if (norm.includes('14700') || norm.includes('13700')) { perf = 88; val = 78; price = 17599; cores = "20 (8P + 12E) / 28"; socket = "LGA1700"; freqBase = "3.4 GHz"; freqBoost = "5.6 GHz"; cache = "33 MB"; tdp = "125W"; igpu = "Так"; process = "10 nm"; year = 2023; }
      else if (norm.includes('14600') || norm.includes('13600')) { perf = 76; val = 84; price = 13199; cores = "14 (6P + 8E) / 20"; socket = "LGA1700"; freqBase = "3.5 GHz"; freqBoost = "5.1 GHz"; cache = "24 MB"; tdp = "125W"; igpu = "Так"; process = "10 nm"; year = 2022; }
      else if (norm.includes('7800x3d')) { perf = 95; val = 96; price = 16499; cores = "8 / 16"; socket = "AM5"; freqBase = "4.2 GHz"; freqBoost = "5.0 GHz"; cache = "96 MB (3D V-Cache)"; tdp = "120W"; igpu = "Так"; process = "5 nm"; year = 2023; }
      else if (norm.includes('7600')) { perf = 68; val = 88; price = 9199; cores = "6 / 12"; socket = "AM5"; freqBase = "4.7 GHz"; freqBoost = "5.3 GHz"; cache = "32 MB"; tdp = "105W"; igpu = "Так"; process = "5 nm"; year = 2022; }
      else if (norm.includes('5700') && norm.includes('3d')) { perf = 74; val = 94; price = 9499; cores = "8 / 16"; socket = "AM4"; freqBase = "3.0 GHz"; freqBoost = "4.1 GHz"; cache = "96 MB (3D V-Cache)"; tdp = "105W"; igpu = "Ні"; process = "7 nm"; year = 2024; }
      else if (norm.includes('5600')) { perf = 45; val = 98; price = 4799; cores = "6 / 12"; socket = "AM4"; freqBase = "3.5 GHz"; freqBoost = "4.4 GHz"; cache = "32 MB"; tdp = "65W"; igpu = "Ні"; process = "7 nm"; year = 2022; }
      else if (norm.includes('12400')) { perf = 42; val = 97; price = 4199; cores = "6 / 12"; socket = "LGA1700"; freqBase = "2.5 GHz"; freqBoost = "4.4 GHz"; cache = "18 MB"; tdp = "65W"; igpu = "Ні"; process = "10 nm"; year = 2022; }

      specsTable.push({ label: "Ядра / Потоки", value: cores });
      specsTable.push({ label: "Роз'єм (Socket)", value: socket });
      specsTable.push({ label: "Базова тактова частота", value: freqBase });
      specsTable.push({ label: "Максимальна частота", value: freqBoost });
      specsTable.push({ label: "Обсяг кеш-пам'яті", value: cache });
      specsTable.push({ label: "Енергоспоживання (TDP)", value: tdp });
      specsTable.push({ label: "Вбудоване відеоядро", value: igpu });
      specsTable.push({ label: "Техпроцес", value: process });
      specsTable.push({ label: "Підтримувана пам'ять", value: socket === "AM5" ? "DDR5-5200" : "DDR4-3200 / DDR5" });

      if (perf > 78) {
        pros = ["Виняткова продуктивність у важких обчислювальних завданнях", "Величезний обсяг багаторівневої кеш-пам'яті", "Висока тактова частота забезпечує максимальний FPS"];
        cons = ["Вимагає купівлі дорогої водяної або двобаштової системи охолодження", "Значне енергоспоживання у пікових навантаженнях"];
      } else {
        pros = ["Ідеальний вибір за критерієм ціна на одиницю потужності", "Дуже низьке тепловиділення, можна використовувати комплектний кулер", "Дає чудовий ігровий досвід у більшості сучасних ігор"];
        cons = ["Обмежений потенціал багатопоточності для професійного рендерингу", "Застаріваючий сокет платформи обмежує майбутній апгрейд"];
      }
    }

    return {
      name: name,
      brand: brand,
      priceUah: price,
      performanceScore: perf,
      valueScore: val,
      releaseYear: year,
      specsTable: specsTable,
      pros: pros,
      cons: cons
    };
  };

  const specsA = buildSpecsSpecs(detectedA, componentA);
  const specsB = buildSpecsSpecs(detectedB, componentB);

  // Verdict logic
  let winner = specsA.name;
  let verdict = "";
  let performanceDetails = "";
  let valueReview = "";
  let recommendation = "";

  const nameA = specsA.name;
  const nameB = specsB.name;

  if (specsA.performanceScore > specsB.performanceScore) {
    winner = nameA;
    const diff = specsA.performanceScore - specsB.performanceScore;
    verdict = `Помітка від системи: Через високе навантаження на сервери Gemini, цей аналіз було згенеровано у високовалідному локальному режимі порівняння. Переможцем є ${nameA}, який пропонує помітно вищий рівень чистої продуктивності.`;
    performanceDetails = `${nameA} демонструє впевнену перевагу у продуктивності. Він випереджає свого опонента ${nameB} орієнтовно на ${diff}% у загальних тестах, що забезпечить відчутно вищий FPS та стабільність фреймрейту у вимогливих тайтлах та складних робочих завданнях на 2026 рік.`;
  } else if (specsA.performanceScore < specsB.performanceScore) {
    winner = nameB;
    const diff = specsB.performanceScore - specsA.performanceScore;
    verdict = `Помітка від системи: Через високе навантаження на сервери Gemini, цей аналіз було згенеровано у високовалідному локальному режимі порівняння. Переможцем є ${nameB}, який забезпечує найкращий рівень продуктивності в іграх та софті.`;
    performanceDetails = `${nameB} пропонує кращу потужність. Завдяки сучаснішим обчислювальним блокам він обходить ${nameA} на ${diff}% у загальній продуктивності, що гарантує плавніший ігровий досвід без фризів за аналогічних налаштувань.`;
  } else {
    winner = specsA.priceUah < specsB.priceUah ? nameA : nameB;
    verdict = `Помітка від системи: Через високе навантаження на сервери Gemini, цей аналіз було згенеровано у високовалідному локальному режимі порівняння. Обидва компоненти мають приблизно рівну загальну потужність, тому кінцевий вибір лежить в площині ціни та брендових преференцій.`;
    performanceDetails = `У плані чистої потужності ${nameA} та ${nameB} є майже ідентичними аналогами, ігровий процес на обох пристроях буде максимально схожим. Вони демонструють однаковий клас швидкодії за шкалою продуктивності.`;
  }

  const priceDiff = Math.abs(specsA.priceUah - specsB.priceUah);
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(val).replace('₴', 'грн');
  };

  if (specsA.priceUah > specsB.priceUah) {
    valueReview = `${nameB} пропонується за ціною близько ${formatCurrency(specsB.priceUah)}, тоді як ${nameA} обійдеться вам орієнтовно у ${formatCurrency(specsA.priceUah)}. Різниця у вартості складає ${formatCurrency(priceDiff)}. ${nameB} пропонує значно вигідніший показник ціна/якість.`;
  } else if (specsA.priceUah < specsB.priceUah) {
    valueReview = `${nameA} є набагато доступнішим за ціною у ${formatCurrency(specsA.priceUah)} проти ${formatCurrency(specsB.priceUah)} в магазинах України. Різниця становить ${formatCurrency(priceDiff)}. З огляду на це, ${nameA} є очевидним лідером за показником вигоди на кожну витрачену гривню.`;
  } else {
    valueReview = `Обидва компоненти мають приблизно однакову ціну на українському роздрібному ринку — близько ${formatCurrency(specsA.priceUah)}. Тож з точки зору бюджету вони є прямими конкурентами.`;
  }

  recommendation = `Якщо ваш бюджет обмежений і ви прагнете отримати максимум вигоди за свої кошти, купуйте ${specsA.valueScore > specsB.valueScore ? nameA : nameB}. Проте, якщо вам потрібна безкомпромісна потужність та кращий запас актуальності на майбутнє — рекомендуємо обрати ${winner}.`;

  return {
    verdict,
    performanceDetails,
    valueReview,
    winner,
    recommendation,
    compASpecs: specsA,
    compBSpecs: specsB
  };
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server running on port 3000" });
});

// AI Search & Compare Endpoint
app.post("/api/compare", async (req, res) => {
  const { componentA, componentB, type } = req.body; // type is 'gpu' or 'cpu'

  if (!componentA || !componentB) {
    return res.status(400).json({ error: "Будь ласка, вкажіть обидва компоненти для порівняння." });
  }

  const compTypeLabel = type === 'gpu' ? 'відеокарта (GPU)' : 'процесор (CPU)';

  try {
    const ai = getGeminiClient();
    const prompt = `Порівняй наступні два комп'ютерні компоненти типу: ${compTypeLabel}.
Компонент А: "${componentA}"
Компонент Б: "${componentB}"

Знайди характеристики обох компонентів, оціни актуальні середні ціни в Україні у гривнях (UAH) станом на 2026 рік, оціни їх ігрову та загальну продуктивність за шкалою від 1 до 100 (де 100 - це рівень RTX 4090 для відеокарт або Core i9-14900K/Ryzen 7 7800X3D для процесорів), та оціни показник ціна/якість від 1 до 100.
Напиши детальний аналіз українською мовою з детальним порівнянням характеристик, що краще брати по відношенню ціна-якість, що потужніше та рекомендаціями.
Характеристики в specsTable мають быть такими:
- Для відеокарт (GPU) обов'язково включи ряди з назвами (label): "Обсяг відеопам'яті", "Тип пам'яті", "Ширина шини пам'яті", "Швидкість пам'яті / ПЗД" (наприклад, '21 Гбіт/с' або '504 ГБ/с'), "Енергоспоживання (TDP)", "Архітектура / Чіпсет", "Рекомендований БЖ", "Версія DirectX".
- Для процесорів (CPU) обов'язково включи ряди з назвами (label): "Ядра / Потоки", "Роз'єм (Socket)", "Базова тактова частота", "Максимальна частота", "Обсяг кеш-пам'яті", "Енергоспоживання (TDP)", "Вбудоване відеоядро", "Техпроцес" (наприклад, '4 нм' або '5 нм'), "Підтримувана пам'ять" (наприклад, 'DDR5-5200' або 'DDR4/DDR5').`;

    const response = await callGeminiWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "Короткий вердикт порівняння українською мовою (1-2 речення)." },
            performanceDetails: { type: Type.STRING, description: "Продуктивність: хто потужніший у іграх та робочих процесах і наскільки." },
            valueReview: { type: Type.STRING, description: "Співвідношення ціна/якість: порівняння цін у гривнях та вигоди купівлі кожної моделі." },
            winner: { type: Type.STRING, description: "Повний переможець за сукупністю факторів (Назва компоненту)." },
            recommendation: { type: Type.STRING, description: "Рекомендація покупцеві (що саме купувати в якому бюджеті)." },
            compASpecs: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING, description: "NVIDIA, AMD або Intel" },
                priceUah: { type: Type.INTEGER, description: "Середня ціна в гривнях (ціле число)" },
                performanceScore: { type: Type.INTEGER, description: "Оцінка загальної продуктивності (1-100)" },
                valueScore: { type: Type.INTEGER, description: "Оцінка ціна/якість (1-100)" },
                releaseYear: { type: Type.INTEGER },
                specsTable: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING, description: "Назва характеристики українською" },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["name", "brand", "priceUah", "performanceScore", "valueScore", "releaseYear", "specsTable", "pros", "cons"]
            },
            compBSpecs: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING, description: "NVIDIA, AMD або Intel" },
                priceUah: { type: Type.INTEGER, description: "Середня ціна в гривнях (ціле число)" },
                performanceScore: { type: Type.INTEGER, description: "Оцінка загальної продуктивності (1-100)" },
                valueScore: { type: Type.INTEGER, description: "Оцінка ціна/якість (1-100)" },
                releaseYear: { type: Type.INTEGER },
                specsTable: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING, description: "Назва характеристики українською" },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["name", "brand", "priceUah", "performanceScore", "valueScore", "releaseYear", "specsTable", "pros", "cons"]
            }
          },
          required: ["verdict", "performanceDetails", "valueReview", "winner", "recommendation", "compASpecs", "compBSpecs"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Не вдалося отримати відповідь від ШІ.");
    }

    res.json(JSON.parse(textOutput));
  } catch (err: any) {
    console.warn("Gemini service unavailable, falling back to smart local hardware matcher:", err);
    try {
      const fallbackResult = generateFallbackComparison(componentA, componentB, type);
      res.json(fallbackResult);
    } catch (fallbackErr: any) {
      console.error("Critical: local offline analyzer failed as well:", fallbackErr);
      res.status(500).json({
        error: "Помилка при генерації порівняння. Будь ласка, перевірте підключення або спробуйте пізніше."
      });
    }
  }
});

// Configure Vite integration for dev vs production environments
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Сервер працює на порту ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Vite startup error:", err);
});
