import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  TrendingUp, 
  Wallet, 
  Award, 
  Scale, 
  Search, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { POPULAR_GPUS, POPULAR_CPUS } from './data';
import { GPUComponent, CPUComponent, BaseComponent } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'gpu' | 'cpu'>('gpu');
  
  // States for chosen components
  const [selectedAId, setSelectedAId] = useState<string>(POPULAR_GPUS[1].id); // RTX 4070 Super
  const [selectedBId, setSelectedBId] = useState<string>(POPULAR_GPUS[3].id); // RTX 4060
  
  // Custom text input mode states
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customAName, setCustomAName] = useState<string>('');
  const [customBName, setCustomBName] = useState<string>('');
  
  // Collapse state for catalogue
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);

  // AI comparison response
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Staged loading subtext in Ukrainian for a fun loading experience
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingTexts = [
    "Зчитуємо бази даних та технічні специфікації...",
    "Оцінюємо актуальні ціни на українському ринку (UAH)...",
    "Проводимо порівняльний аналіз архітектур та ядер...",
    "Аналізуємо співвідношення ціни до продуктивності (FPS/грн)...",
    "Формулюємо експертний вердикт від Gemini..."
  ];

  useEffect(() => {
    let interval: any;
    if (loadingAi) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loadingAi]);

  // Handle active tab change
  const handleTabChange = (tab: 'gpu' | 'cpu') => {
    setActiveTab(tab);
    setAiResult(null);
    setAiError(null);
    if (tab === 'gpu') {
      setSelectedAId(POPULAR_GPUS[1].id);
      setSelectedBId(POPULAR_GPUS[3].id);
    } else {
      setSelectedAId(POPULAR_CPUS[0].id);
      setSelectedBId(POPULAR_CPUS[3].id);
    }
  };

  // Get current active catalogue
  const catalog = activeTab === 'gpu' ? POPULAR_GPUS : POPULAR_CPUS;
  const currentA = catalog.find(item => item.id === selectedAId) || catalog[0];
  const currentB = catalog.find(item => item.id === selectedBId) || catalog[1];

  // Submit dynamic comparison to Gemini API
  const handleAiCompare = async (isCustom: boolean = false) => {
    setLoadingAi(true);
    setAiError(null);
    setAiResult(null);

    const nameA = isCustom ? customAName.trim() : currentA.name;
    const nameB = isCustom ? customBName.trim() : currentB.name;

    if (isCustom && (!nameA || !nameB)) {
      setAiError("Будь ласка, введіть назви обох моделей комплектуючих.");
      setLoadingAi(false);
      return;
    }

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          componentA: nameA,
          componentB: nameB,
          type: activeTab
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Помилка відповіді сервера");
      }
      setAiResult(data);
    } catch (err: any) {
      setAiError(err.message || "Не вдалося з'єднатися з AI-сервером. Переконайтеся, що GEMINI_API_KEY налаштовано.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Helper formatting for currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(val);
  };

  // Pre-calculated stats (using built-in catalog if not in customized AI-mode)
  const renderBuiltInComparison = () => {
    const pA = currentA.performanceScore;
    const pB = currentB.performanceScore;
    const priceA = currentA.priceUah;
    const priceB = currentB.priceUah;

    const powerWinner = pA > pB ? currentA : (pA < pB ? currentB : null);
    const powerWinnerPercent = pA > pB 
      ? Math.round(((pA - pB) / pB) * 100) 
      : Math.round(((pB - pA) / pA) * 100);

    // Value score calculation: Performance score per thousand UAH
    const valA = (pA / priceA) * 10000;
    const valB = (pB / priceB) * 10000;
    const valueWinner = valA > valB ? currentA : (valA < valB ? currentB : null);
    const valueWinnerPercent = valA > valB
      ? Math.round(((valA - valB) / valB) * 100)
      : Math.round(((valB - valA) / valA) * 100);

    return (
      <div id="comparison-analysis" className="space-y-6">
        {/* Quick Badges Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Power card */}
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 flex items-start space-x-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-sm text-slate-400 font-medium">Найпотужніший вибір</h4>
              {powerWinner ? (
                <p className="text-lg font-bold text-white mt-1">
                  {powerWinner.name} <span className="text-amber-400 text-sm font-normal">({powerWinnerPercent}% швидший)</span>
                </p>
              ) : (
                <p className="text-lg font-bold text-white mt-1">Обидва однакові за потужністю</p>
              )}
            </div>
          </div>

          {/* Value Winner Card */}
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 flex items-start space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-sm text-slate-400 font-medium">Король ціна / якість</h4>
              {valueWinner ? (
                <p className="text-lg font-bold text-white mt-1">
                  {valueWinner.name} <span className="text-emerald-400 text-sm font-normal">(на +{valueWinnerPercent}% вигідніший)</span>
                </p>
              ) : (
                <p className="text-lg font-bold text-white mt-1">Рівноцінна вигода</p>
              )}
            </div>
          </div>
        </div>

        {/* Visual comparison indicators */}
        <div className="bg-[#121214] border border-[#222222] rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white border-b border-[#222222] pb-3 flex items-center gap-2">
            <Scale size={20} className="text-cyan-500" /> Візуальний Баланс Потужності та Ціни
          </h3>

          <div className="space-y-4">
            {/* Performance Bar compare */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-slate-300">Ігрова/Обчислювальна потужність</span>
                <span className="text-xs text-slate-400">Рейтинг продуктивності</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300">{currentA.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentA.performanceScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-cyan-500 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-cyan-400 text-right w-8">{currentA.performanceScore}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300">{currentB.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentB.performanceScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-red-500 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-red-400 text-right w-8">{currentB.performanceScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price compare */}
            <div className="pt-2">
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-slate-300">Ціна комплектуючого</span>
                <span className="text-xs text-slate-400">Роздрібна вартість в UAH</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300">{currentA.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (currentA.priceUah / 120000) * 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-cyan-500/50 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-emerald-400 text-right w-24 text-xs sm:text-sm">{formatCurrency(currentA.priceUah)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300">{currentB.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (currentB.priceUah / 120000) * 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-red-500/50 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-emerald-400 text-right w-24 text-xs sm:text-sm">{formatCurrency(currentB.priceUah)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Characteristics Matrix */}
        <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 overflow-hidden">
          <h4 className="text-md font-semibold text-white mb-4 pb-2 border-b border-[#222222] font-display flex items-center gap-1.5">
            <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
            Характеристики та порівняльна таблиця
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-slate-400 text-xs uppercase border-b border-[#222222]">
                  <th className="py-2.5 font-medium">Характеристика</th>
                  <th className="py-2.5 px-4 font-bold text-cyan-500">{currentA.name}</th>
                  <th className="py-2.5 px-4 font-bold text-red-500">{currentB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]/80 text-slate-300">
                <tr>
                  <td className="py-3 font-medium text-slate-400">Бренд</td>
                  <td className="py-3 px-4">{currentA.brand}</td>
                  <td className="py-3 px-4">{currentB.brand}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-400">Рік випуску</td>
                  <td className="py-3 px-4">{currentA.releaseYear}</td>
                  <td className="py-3 px-4">{currentB.releaseYear}</td>
                </tr>
                {/* Dynamically align specs based on keys */}
                {Array.from(new Set([...Object.keys(currentA.specs), ...Object.keys(currentB.specs)])).map((key) => {
                  const getLabelUk = (k: string) => {
                    const dict: Record<string, string> = {
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
                    return dict[k] || k;
                  };

                  return (
                    <tr key={key} className="hover:bg-[#1a1a1d]/30 transition-colors">
                      <td className="py-3 font-medium text-slate-400">{getLabelUk(key)}</td>
                      <td className="py-3 px-4 font-medium">{String(currentA.specs[key as keyof typeof currentA.specs] ?? '—')}</td>
                      <td className="py-3 px-4 font-medium">{String(currentB.specs[key as keyof typeof currentB.specs] ?? '—')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros & Cons list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A Pros and Cons */}
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 font-display">
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></span> {currentA.name}
            </h4>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} /> Переваги:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {currentA.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsDown size={12} /> Недоліки:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {currentA.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card B Pros and Cons */}
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 font-display">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> {currentB.name}
            </h4>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} /> Переваги:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {currentB.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsDown size={12} /> Недоліки:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {currentB.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Call Gemini comparison triggers */}
        <div className="bg-gradient-to-br from-cyan-950/20 to-[#121214] border border-cyan-500/20 rounded-2xl p-5 sm:p-6 text-center space-y-4">
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-md font-semibold text-cyan-400 flex items-center justify-center gap-1.5 font-display">
              <Sparkles size={18} className="text-amber-400 animate-pulse" /> Глибокий AI-Аналіз від Gemini 3.5
            </h4>
            <p className="text-xs text-slate-400">
              Бажаєте детальний опис життєздатності збірки, FPS в іграх, аналіз енергоспоживання у гривнях та поради щодо апгрейду?
            </p>
          </div>
          <button
            onClick={() => handleAiCompare(false)}
            disabled={loadingAi}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-sm transition-all focus:ring-2 focus:ring-cyan-500/50 focus:outline-none disabled:opacity-50 flex items-center gap-2 mx-auto active:scale-98 cursor-pointer shadow-lg"
          >
            {loadingAi ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loadingAi ? "ШІ аналізує..." : "Отримати детальний ШІ аналіз"}
          </button>
        </div>
      </div>
    );
  };

  // Render specifications returned by dynamic Gemini endpoint
  const renderAiResultComparison = () => {
    if (!aiResult) return null;

    const compA = aiResult.compASpecs;
    const compB = aiResult.compBSpecs;

    return (
      <div className="space-y-6">
        {/* Dynamic score summary badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 flex items-start space-x-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-sm text-slate-400 font-medium">Переможець за версією ШІ</h4>
              <p className="text-lg font-bold text-cyan-400 mt-1">{aiResult.winner}</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 flex items-start space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-sm text-slate-400 font-medium">Короткий вердикт</h4>
              <p className="text-sm text-slate-200 mt-1 line-clamp-2 md:line-clamp-none">{aiResult.verdict}</p>
            </div>
          </div>
        </div>

        {/* Dynamic visual scores from AI */}
        <div className="bg-[#121214] border border-[#222222] rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Scale size={20} className="text-cyan-500" /> Співвідношення оцінок від Gemini
          </h3>

          <div className="space-y-4">
            {/* AI Performance core comparison */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-slate-300">Оцінка відносної сили заліза</span>
                <span className="text-xs text-slate-400">Шкала 1-100</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300 font-medium">{compA.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${compA.performanceScore}%` }}
                        className="bg-cyan-500 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-cyan-400 text-right w-8">{compA.performanceScore}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300 font-medium">{compB.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${compB.performanceScore}%` }}
                        className="bg-red-500 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-red-400 text-right w-8">{compB.performanceScore}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Value ratio */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-slate-300 font-medium">Оцінка привабливості Ціна/Якість</span>
                <span className="text-xs text-slate-400">Шкала 1-100</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300 font-normal">{compA.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${compA.valueScore}%` }}
                        className="bg-cyan-500/50 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-cyan-400 text-right w-8">{compA.valueScore}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="truncate max-w-[150px] sm:max-w-xs text-slate-300 font-normal">{compB.name}</span>
                  <div className="flex items-center gap-3 w-3/5">
                    <div className="flex-1 bg-[#09090b] h-2.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${compB.valueScore}%` }}
                        className="bg-red-500/50 h-full rounded-full"
                      />
                    </div>
                    <span className="font-bold text-red-400 text-right w-8">{compB.valueScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Detailed analysis reports */}
        <div className="bg-[#121214] border border-[#222222] rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-1.5 font-display">
              <Zap size={18} /> Порівняння продуктивності
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#09090b]/60 p-4 rounded-xl border border-[#222222]">
              {aiResult.performanceDetails}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-1.5 font-display">
              <Wallet size={18} /> Фінансовий аналіз та Ціна-Якість
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#09090b]/60 p-4 rounded-xl border border-[#222222]">
              {aiResult.valueReview}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-1.5 font-display">
              <Sparkles size={18} /> Чітка рекомендація для купівлі
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">
              {aiResult.recommendation}
            </p>
          </div>
        </div>

        {/* Dynamic Specification table */}
        <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 overflow-hidden">
          <h4 className="text-md font-semibold text-white mb-4 pb-2 border-b border-[#222222] font-display flex items-center gap-1.5">
            <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
            Характеристики від ШІ
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-slate-400 text-xs uppercase border-b border-[#222222]">
                  <th className="py-2.5 font-medium">Характеристика</th>
                  <th className="py-2.5 px-4 font-bold text-cyan-500">{compA.name}</th>
                  <th className="py-2.5 px-4 font-bold text-red-500">{compB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]/80 text-slate-300">
                <tr>
                  <td className="py-3 font-medium text-slate-400">Орієнтовна Ціна</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{formatCurrency(compA.priceUah)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{formatCurrency(compB.priceUah)}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-400">Виробник</td>
                  <td className="py-3 px-4">{compA.brand}</td>
                  <td className="py-3 px-4">{compB.brand}</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-400">Рік випуску</td>
                  <td className="py-3 px-4">{compA.releaseYear}</td>
                  <td className="py-3 px-4">{compB.releaseYear}</td>
                </tr>
                {/* Find standard table rows by mapping A items */}
                {compA.specsTable?.map((row: any, idx: number) => {
                  const bRowResult = compB.specsTable?.find((b: any) => b.label === row.label) || compB.specsTable?.[idx];
                  return (
                    <tr key={idx} className="hover:bg-[#1a1a1d]/30 transition-colors">
                      <td className="py-3 font-medium text-slate-400">{row.label}</td>
                      <td className="py-3 px-4 font-medium">{row.value}</td>
                      <td className="py-3 px-4 font-medium">{bRowResult ? bRowResult.value : 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros & Cons extracted dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 font-display">
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></span> {compA.name}
            </h4>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} /> Переваги:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {compA.pros?.map((pro: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsDown size={12} /> Недоліки:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {compA.cons?.map((con: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#121214] border border-[#222222] rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 font-display">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span> {compB.name}
            </h4>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsUp size={12} /> Переваги:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {compB.pros?.map((pro: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <ThumbsDown size={12} /> Недоліки:
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none pl-0">
                {compB.cons?.map((con: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <AlertCircle size={13} className="text-rose-400 mt-0.5 shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Return to built-in comparison */}
        <div className="text-center pt-2">
          <button
            onClick={() => setAiResult(null)}
            className="text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 mx-auto cursor-pointer"
          >
            <RefreshCw size={12} /> Очистити ШІ аналіз та повернутись до базового каталогу
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16 px-4 md:px-8 bg-[#0c0c0e] text-slate-300 selection:bg-cyan-500 selection:text-black font-sans">
      
      {/* Maximum Responsive frame width */}
      <div className="w-full max-w-5xl mx-auto space-y-6 pt-6">

        {/* App Title / Header */}
        <header className="text-center md:text-left md:flex md:items-center md:justify-between py-4 border-b border-[#222222]">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-500 mb-1">
              <Cpu className="animate-pulse" />
              <span className="text-xs tracking-widest uppercase font-bold font-display">TECH<span className="text-cyan-500">CORE</span> 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-white">Порівняння Компонентів ПК</h1>
            <p className="text-xs md:text-sm text-slate-400 font-light mt-1">
              Знайдіть краще залізо по відношенню ціна-якість та дізнайтесь актуальну вартість у гривнях.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-[#09090b] p-1 rounded-xl border border-[#222222] flex gap-1">
            <button
              onClick={() => handleTabChange('gpu')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'gpu' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'}`}
            >
              <Layers size={14} /> Відеокарти
            </button>
            <button
              onClick={() => handleTabChange('cpu')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'cpu' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'}`}
            >
              <Cpu size={14} /> Процесори
            </button>
          </div>
        </header>

        {/* Configuration panel (Selectors for A and B) */}
        <section className="bg-[#121214] p-5 sm:p-6 border border-[#222222] rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222222] pb-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-md font-bold text-white flex items-center justify-center sm:justify-start gap-1.5 font-display">
                <Scale size={18} className="text-cyan-500" /> Конфігуратор Порівняння
              </h2>
              <p className="text-xs text-slate-400">
                Оберіть залізо з нашого каталогу або введіть власні моделі й доручіть ШІ знайти й порівняти їх.
              </p>
            </div>

            <div className="bg-[#09090b] border border-[#222222] rounded-xl p-0.5 flex">
              <button
                onClick={() => { setCustomMode(false); setAiResult(null); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${!customMode ? 'bg-[#222222] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                З каталогу
              </button>
              <button
                onClick={() => { setCustomMode(true); setAiResult(null); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${customMode ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Власна модель (ШІ)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Component A choice channel */}
            <div className="p-4 bg-[#09090b] rounded-xl border border-[#222222] space-y-3">
              <span className="text-xs uppercase tracking-wider font-bold text-cyan-500 block">Компонент А</span>
              {!customMode ? (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Виберіть модель</label>
                  <select
                    value={selectedAId}
                    onChange={(e) => { setSelectedAId(e.target.value); setAiResult(null); }}
                    className="w-full bg-[#1a1a1d] border border-[#333333] hover:border-[#44444a] text-slate-200 py-2.5 px-3 rounded-lg text-sm transition-all focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {catalog.map(item => (
                      <option key={item.id} value={item.id} className="bg-[#0c0c0e]">
                        {item.name} ({formatCurrency(item.priceUah)})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <label className="text-xs text-slate-400 block mb-1">Назва компонента (напр. RTX 2060, Intel i3-10100F)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Введіть повну модель"
                      value={customAName}
                      onChange={(e) => setCustomAName(e.target.value)}
                      className="w-full bg-[#1a1a1d] hover:bg-slate-800 border border-[#333333] focus:border-cyan-500 rounded-lg text-sm text-slate-100 px-3 py-2.5 focus:outline-none placeholder:text-slate-500 transition-all font-medium"
                    />
                    <Search size={14} className="absolute right-3 top-3 text-slate-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Component B choice channel */}
            <div className="p-4 bg-[#09090b] rounded-xl border border-[#222222] space-y-3">
              <span className="text-xs uppercase tracking-wider font-bold text-red-500 block">Компонент Б</span>
              {!customMode ? (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Виберіть модель</label>
                  <select
                    value={selectedBId}
                    onChange={(e) => { setSelectedBId(e.target.value); setAiResult(null); }}
                    className="w-full bg-[#1a1a1d] border border-[#333333] hover:border-[#44444a] text-slate-200 py-2.5 px-3 rounded-lg text-sm transition-all focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {catalog.map(item => (
                      <option key={item.id} value={item.id} className="bg-[#0c0c0e]">
                        {item.name} ({formatCurrency(item.priceUah)})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="relative">
                  <label className="text-xs text-slate-400 block mb-1">Назва компонента (напр. RX 580 8GB, Ryzen 5 3600)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Введіть повну модель"
                      value={customBName}
                      onChange={(e) => setCustomBName(e.target.value)}
                      className="w-full bg-[#1a1a1d] hover:bg-slate-800 border border-[#333333] focus:border-red-500 rounded-lg text-sm text-slate-100 px-3 py-2.5 focus:outline-none placeholder:text-slate-500 transition-all font-medium"
                    />
                    <Search size={14} className="absolute right-3 top-3 text-slate-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {customMode && (
            <div className="pt-3 text-center">
              <button
                onClick={() => handleAiCompare(true)}
                disabled={loadingAi}
                className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                {loadingAi ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Згенерувати ШІ-порівняння для власних моделей
              </button>
            </div>
          )}
        </section>

        {/* Loading overlay with staged animations */}
        <AnimatePresence mode="wait">
          {loadingAi && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#121214]/95 border border-cyan-500/20 rounded-2xl p-8 text-center space-y-6"
            >
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="relative flex justify-center items-center">
                  {/* Rotating visual component outer ring */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-dashed border-cyan-500/40 border-t-cyan-400"
                  />
                  <Cpu className="absolute text-cyan-500 animate-pulse" size={24} />
                </div>
                <div className="space-y-2 font-display">
                  <h3 className="text-lg font-bold text-white">Gemini 3.5 створює порівняння</h3>
                  <p className="text-xs text-cyan-400 max-w-sm mx-auto font-medium font-mono tracking-tight transition-all">
                    {loadingTexts[loadingStep]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {aiError && (
          <div className="bg-red-950/20 border border-red-500/30 text-rose-200 px-4 py-3.5 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <div>
              <span className="font-bold text-red-400">Помилка AI:</span> {aiError}
              <p className="mt-1 text-slate-400">
                Спробуйте замінити запит або почекайте кілька секунд. Також це може відбуватися, якщо локальний ключ GEMINI_API_KEY конфігурується в налаштуваннях.
              </p>
            </div>
          </div>
        )}

        {/* Core Results Block */}
        {!loadingAi && !aiError && (
          <div className="space-y-6">
            {aiResult ? renderAiResultComparison() : renderBuiltInComparison()}
          </div>
        )}

        {/* Predefined Catalogue quick clicks */}
        {!customMode && (
          <section className="space-y-4 pt-4 border-t border-[#222222]">
            <div 
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="bg-[#0e0e11] hover:bg-[#121216] border border-[#222222] hover:border-cyan-500/40 p-4 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row items-center justify-between gap-4 select-none group shadow-md"
            >
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="p-2 bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 rounded-lg group-hover:scale-105 transition-all">
                  <Layers size={18} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5 font-display">
                    Каталог популярного заліза ({activeTab === 'gpu' ? 'відеокарти' : 'процесори'})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Швидкий вибір готових моделей для порівняння в реальному часі.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {isCatalogOpen ? "Приховати список" : `Відкрити список (${catalog.length} моделей)`}
                </span>
                <motion.div
                  animate={{ rotate: isCatalogOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-400 group-hover:text-cyan-400"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isCatalogOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {catalog.map((item) => {
                      const isSelected = selectedAId === item.id || selectedBId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            // Alternate assigning to A or B
                            if (selectedAId !== item.id && selectedBId !== item.id) {
                              setSelectedBId(selectedAId);
                              setSelectedAId(item.id);
                              setAiResult(null);
                              setAiError(null);
                            }
                          }}
                          className={`p-4 bg-[#121214] hover:bg-[#1a1a1d] rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 active:scale-98 ${isSelected ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-[#222222] hover:border-slate-600'}`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.brand === 'NVIDIA' ? 'bg-green-500/10 text-green-400' : (item.brand === 'Intel' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-500')}`}>
                                {item.brand}
                              </span>
                              <span className="text-[10px] text-slate-400">{item.releaseYear} рік</span>
                            </div>
                            <h4 className="font-semibold text-slate-100 text-sm mt-2">{item.name}</h4>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#222222] pt-2 text-xs">
                            <div className="space-y-0.5">
                              <span className="text-slate-400 text-[10px]">Ціна в Україні</span>
                              <p className="font-bold text-emerald-400">{formatCurrency(item.priceUah)}</p>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="text-slate-400 text-[10px]">Клас (1-100)</span>
                              <p className="font-bold text-cyan-400">{item.performanceScore}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Footer info banner */}
        <footer className="pt-8 border-t border-[#222222] text-center space-y-3 text-slate-500">
          <p className="text-xs">
            © 2026 Порівняння Комплектуючих ПК — Всі ціни вказано орієнтовно за даними українського роздрібного ринку.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px]">
            <Info size={11} className="text-cyan-500" />
            <span>Спеціально оптимізовано для мобільних пристроїв та планшетів. Чудово працює у будь-якому розмірі екрану!</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
