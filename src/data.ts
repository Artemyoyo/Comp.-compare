import { GPUComponent, CPUComponent } from './types';

export const POPULAR_GPUS: GPUComponent[] = [
  {
    id: 'rtx-4090',
    name: 'NVIDIA GeForce RTX 4090',
    brand: 'NVIDIA',
    priceUah: 85999,
    performanceScore: 100,
    valueScore: 40,
    releaseYear: 2022,
    specs: {
      memorySize: '24 GB',
      memoryType: 'GDDR6X',
      busWidth: '384-bit',
      memorySpeed: '21 Gbps (1008 GB/s)',
      powerTdp: '450W',
      chipset: 'Ada Lovelace',
      recommendedPsu: '850W',
      directX: '12 Ultimate'
    },
    pros: [
      'Абсолютно найпотужніша відеокарта на ринку',
      '24 ГБ надшвидкої відеопам\'яті',
      'Найкраща продуктивність трасування променів та DLSS 3.0'
    ],
    cons: [
      'Надзвичайно висока ціна',
      'Велике енергоспоживання (450W)',
      'Величезні фізичні розміри'
    ]
  },
  {
    id: 'rtx-4070-super',
    name: 'NVIDIA GeForce RTX 4070 Super',
    brand: 'NVIDIA',
    priceUah: 29499,
    performanceScore: 78,
    valueScore: 82,
    releaseYear: 2024,
    specs: {
      memorySize: '12 GB',
      memoryType: 'GDDR6X',
      busWidth: '192-bit',
      memorySpeed: '21 Gbps (504 GB/s)',
      powerTdp: '220W',
      chipset: 'Ada Lovelace',
      recommendedPsu: '650W',
      directX: '12 Ultimate'
    },
    pros: [
      'Чудова продуктивність у 1440p на максимальних налаштуваннях',
      'Енергоефективна та тиха у порівнянні з попередниками',
      'Підтримка генерації кадрів (DLSS 3)'
    ],
    cons: [
      '12 ГБ пам\'яті може бути впритул для майбутніх ігор у 4K',
      'Дорожча за конкурента від AMD з аналогічним об\'ємом пам\'яті'
    ]
  },
  {
    id: 'rtx-4060-ti',
    name: 'NVIDIA GeForce RTX 4060 Ti',
    brand: 'NVIDIA',
    priceUah: 18499,
    performanceScore: 56,
    valueScore: 70,
    releaseYear: 2023,
    specs: {
      memorySize: '8 GB',
      memoryType: 'GDDR6',
      busWidth: '128-bit',
      memorySpeed: '18 Gbps (288 GB/s)',
      powerTdp: '160W',
      chipset: 'Ada Lovelace',
      recommendedPsu: '550W',
      directX: '12 Ultimate'
    },
    pros: [
      'Дуже низьке енергоспоживання',
      'Генерація кадрів та чудова ефективність для FullHD',
      'Холодна в роботі'
    ],
    cons: [
      'Вузька шина пам\'яті 128-біт',
      'Обсяг пам\'яті всього 8 ГБ, що мало для ультра-текстур'
    ]
  },
  {
    id: 'rtx-4060',
    name: 'NVIDIA GeForce RTX 4060',
    brand: 'NVIDIA',
    priceUah: 13799,
    performanceScore: 46,
    valueScore: 86,
    releaseYear: 2023,
    specs: {
      memorySize: '8 GB',
      memoryType: 'GDDR6',
      busWidth: '128-bit',
      memorySpeed: '17 Gbps (272 GB/s)',
      powerTdp: '115W',
      chipset: 'Ada Lovelace',
      recommendedPsu: '500W',
      directX: '12 Ultimate'
    },
    pros: [
      'Найкращий вхід в екосистему RTX 40 серії за доступною ціною',
      'Неймовірно низьке споживання енергії (всього 115W)',
      'DLSS 3 суттєво подвоює FPS в нових тайтлах'
    ],
    cons: [
      'Низький приріст чистий чистої потужності без DLSS проти RTX 3060',
      'Обмежена шина PCIe x8'
    ]
  },
  {
    id: 'rtx-3060-12gb',
    name: 'NVIDIA GeForce RTX 3060 12GB',
    brand: 'NVIDIA',
    priceUah: 11999,
    performanceScore: 38,
    valueScore: 88,
    releaseYear: 2021,
    specs: {
      memorySize: '12 GB',
      memoryType: 'GDDR6',
      busWidth: '192-bit',
      memorySpeed: '15 Gbps (360 GB/s)',
      powerTdp: '170W',
      chipset: 'Ampere',
      recommendedPsu: '550W',
      directX: '12'
    },
    pros: [
      'Цілих 12 ГБ відеопам\'яті — вистачить на роки вперед',
      'Доступна ціна та широка сумісність',
      'Хороший вибір для 3D-моделювання та ШІ завдяки пам\'яті'
    ],
    cons: [
      'Застаріла архітектура (немає Frame Generation)',
      'Нижчий FPS в класичному раструванні порівняно з новими картами'
    ]
  },
  {
    id: 'rx-7800-xt',
    name: 'AMD Radeon RX 7800 XT',
    brand: 'AMD',
    priceUah: 23499,
    performanceScore: 73,
    valueScore: 92,
    releaseYear: 2023,
    specs: {
      memorySize: '16 GB',
      memoryType: 'GDDR6',
      busWidth: '256-bit',
      memorySpeed: '19.5 Gbps (624 GB/s)',
      powerTdp: '263W',
      chipset: 'RDNA 3',
      recommendedPsu: '700W',
      directX: '12 Ultimate'
    },
    pros: [
      'Ідеальне співвідношення ціни та продуктивності для 1440р',
      'Великий та надійний об\'єм відеопам\'яті 16 ГБ',
      'Широка 256-бітна шина пам\'яті'
    ],
    cons: [
      'Гірша продуктивність у трасуванні променів проти NVIDIA',
      'FSR 3 дещо поступається за якістю DLSS'
    ]
  },
  {
    id: 'rx-7700-xt',
    name: 'AMD Radeon RX 7700 XT',
    brand: 'AMD',
    priceUah: 19199,
    performanceScore: 62,
    valueScore: 84,
    releaseYear: 2023,
    specs: {
      memorySize: '12 GB',
      memoryType: 'GDDR6',
      busWidth: '192-bit',
      memorySpeed: '18 Gbps (432 GB/s)',
      powerTdp: '245W',
      chipset: 'RDNA 3',
      recommendedPsu: '700W',
      directX: '12 Ultimate'
    },
    pros: [
      'Хороша продуктивність у 1440р на середньо-високих',
      'Сучасна архітектура з апаратним кодуванням AV1',
      'Швидша ніж RTX 4060 Ti у більшості звичайних ігор'
    ],
    cons: [
      'Споживає більше енергії за конкурентів NVIDIA',
      'Невелика різниця в ціні до набагато кращої RX 7800 XT'
    ]
  },
  {
    id: 'rx-7600-xt',
    name: 'AMD Radeon RX 7600 XT',
    brand: 'AMD',
    priceUah: 14799,
    performanceScore: 45,
    valueScore: 87,
    releaseYear: 2024,
    specs: {
      memorySize: '16 GB',
      memoryType: 'GDDR6',
      busWidth: '128-bit',
      memorySpeed: '18 Gbps (288 GB/s)',
      powerTdp: '190W',
      chipset: 'RDNA 3',
      recommendedPsu: '600W',
      directX: '12 Ultimate'
    },
    pros: [
      'Величезний обсяг у 16 ГБ пам\'яті за низьку ціну',
      'Чудово підходить для текстур високої роздільної здатності',
      'Підтримка FSR 3 та Fluid Motion Frames'
    ],
    cons: [
      'Шина пам\'яті всього 128-біт обмежує потенціал 16 ГБ у важких сценах',
      'Продуктивність графічного чіпа ідентична звичайній RX 7600'
    ]
  },
  {
    id: 'rx-6600',
    name: 'AMD Radeon RX 6600',
    brand: 'AMD',
    priceUah: 9499,
    performanceScore: 32,
    valueScore: 95,
    releaseYear: 2021,
    specs: {
      memorySize: '8 GB',
      memoryType: 'GDDR6',
      busWidth: '128-bit',
      memorySpeed: '14 Gbps (224 GB/s)',
      powerTdp: '132W',
      chipset: 'RDNA 2',
      recommendedPsu: '450W',
      directX: '12'
    },
    pros: [
      'Беззаперечний король бюджетного FullHD геймінгу',
      'Дуже низька ціна та збалансовані характеристики',
      'Низькі вимоги до блоку живлення'
    ],
    cons: [
      'Трасування променів практично неможливе специфікацією чіпа',
      'Тільки інтерфейс PCIe x8'
    ]
  },
  {
    id: 'rx-7900-xtx',
    name: 'AMD Radeon RX 7900 XTX',
    brand: 'AMD',
    priceUah: 43999,
    performanceScore: 93,
    valueScore: 86,
    releaseYear: 2022,
    specs: {
      memorySize: '24 GB',
      memoryType: 'GDDR6',
      busWidth: '384-bit',
      memorySpeed: '20 Gbps (960 GB/s)',
      powerTdp: '355W',
      chipset: 'RDNA 3',
      recommendedPsu: '800W',
      directX: '12 Ultimate'
    },
    pros: [
      'Флагманська продуктивність у 4K',
      'Величезний обсяг пам\'яті у 24 ГБ для нейромереж та текстур',
      'Значно дешевша за RTX 4090 при схожій продуктивності в чистій растрації'
    ],
    cons: [
      'Помітно слабша у трасуванні променів порівняно з картами NVIDIA RTX',
      'Високе енергоспоживання у пікових навантаженнях'
    ]
  },
  {
    id: 'rx-6700-xt',
    name: 'AMD Radeon RX 6700 XT',
    brand: 'AMD',
    priceUah: 14999,
    performanceScore: 54,
    valueScore: 94,
    releaseYear: 2021,
    specs: {
      memorySize: '12 GB',
      memoryType: 'GDDR6',
      busWidth: '192-bit',
      memorySpeed: '16 Gbps (384 GB/s)',
      powerTdp: '230W',
      chipset: 'RDNA 2',
      recommendedPsu: '650W',
      directX: '12 Ultimate'
    },
    pros: [
      'Потужна та перевірена часом відеокарта для роздільної здатності 1440р',
      'Оптимальний об\'єм буфера кадрів у 12 ГБ',
      'Дуже низька ціна на вторинному ринку та у роздрібі зараз'
    ],
    cons: [
      'Трасування променів першого покоління RDNA 2 працює дуже повільно',
      'Підтримка FSR дещо слабша, ніж сучасні рішення DLSS'
    ]
  },
  {
    id: 'rx-5700-xt',
    name: 'AMD Radeon RX 5700 XT',
    brand: 'AMD',
    priceUah: 8499,
    performanceScore: 36,
    valueScore: 89,
    releaseYear: 2019,
    specs: {
      memorySize: '8 GB',
      memoryType: 'GDDR6',
      busWidth: '256-bit',
      memorySpeed: '14 Gbps (448 GB/s)',
      powerTdp: '225W',
      chipset: 'RDNA 1',
      recommendedPsu: '600W',
      directX: '12'
    },
    pros: [
      'Все ще показує гідний FPS у більшості сучасних ігор FullHD',
      'Широка 256-бітна шина забезпечує хорошу пропускну здатність',
      'Чудова продуктивність для ретро-геймінгу'
    ],
    cons: [
      'Повністю відсутнє апаратне трасування променів та Mesh Shaders',
      'Відомі проблеми з гарячим відеочіпом на ранніх ревізіях плат'
    ]
  },
  {
    id: 'rx-585', // Representing RX 580 8GB
    name: 'AMD Radeon RX 580 8GB',
    brand: 'AMD',
    priceUah: 3999,
    performanceScore: 18,
    valueScore: 97,
    releaseYear: 2017,
    specs: {
      memorySize: '8 GB',
      memoryType: 'GDDR5',
      busWidth: '256-bit',
      memorySpeed: '8 Gbps (256 GB/s)',
      powerTdp: '185W',
      chipset: 'Polaris 20 XT',
      recommendedPsu: '500W',
      directX: '12'
    },
    pros: [
      'Легендарний народний улюбленець з 8 ГБ швидкої пам\'яті',
      'Супербюджетне рішення для початківців та онлайн-ігор (CS2, Dota 2, LoL)',
      'Неймовірна ціна за такий об\'єм пам\'яті'
    ],
    cons: [
      'Стара архітектура, яка вже не оновлюється драйверами належним чином',
      'Досить шумна під навантаженням та споживає чимало як для своєї швидкості'
    ]
  },
  {
    id: 'gtx-1080-ti',
    name: 'NVIDIA GeForce GTX 1080 Ti',
    brand: 'NVIDIA',
    priceUah: 8999,
    performanceScore: 37,
    valueScore: 90,
    releaseYear: 2017,
    specs: {
      memorySize: '11 GB',
      memoryType: 'GDDR5X',
      busWidth: '352-bit',
      memorySpeed: '11 Gbps (484 GB/s)',
      powerTdp: '250W',
      chipset: 'Pascal',
      recommendedPsu: '600W',
      directX: '12'
    },
    pros: [
      'Легендарна відеокарта "всіх часів", 11 ГБ пам\'яті досі актуальні',
      'Величезна шина 352-біт дає неймовірну пропускну здатність',
      'Справжня інженерна класика з високою якістю збірки'
    ],
    cons: [
      'Не підтримує DLSS та апаратні промені',
      'Значне енергоспоживання і тепловиділення'
    ]
  },
  {
    id: 'gtx-1660-super',
    name: 'NVIDIA GeForce GTX 1660 Super',
    brand: 'NVIDIA',
    priceUah: 7299,
    performanceScore: 26,
    valueScore: 91,
    releaseYear: 2019,
    specs: {
      memorySize: '6 GB',
      memoryType: 'GDDR6',
      busWidth: '192-bit',
      memorySpeed: '14 Gbps (336 GB/s)',
      powerTdp: '125W',
      chipset: 'Turing',
      recommendedPsu: '450W',
      directX: '12'
    },
    pros: [
      'Дуже надійна та енергоефективна відеокарта для FullHD',
      'GDDR6 пам\'ять забезпечує значний приріст проти звичайної 1660',
      'Побудована на стабільній та холодній архітектурі'
    ],
    cons: [
      '6 ГБ відеопам\'яті вже обмежують якість текстур у важких іграх',
      'Немає апаратної підтримки трасування та DLSS'
    ]
  },
  {
    id: 'gtx-1060-6gb',
    name: 'NVIDIA GeForce GTX 1060 6GB',
    brand: 'NVIDIA',
    priceUah: 4699,
    performanceScore: 16,
    valueScore: 93,
    releaseYear: 2016,
    specs: {
      memorySize: '6 GB',
      memoryType: 'GDDR5',
      busWidth: '192-bit',
      memorySpeed: '8 Gbps (192 GB/s)',
      powerTdp: '120W',
      chipset: 'Pascal',
      recommendedPsu: '400W',
      directX: '12'
    },
    pros: [
      'Найпопулярніша відеокарта в історії Steam протягом багатьох років',
      'Відмінна ціна на вживаному ринку під бюджетну збірку',
      'Надійна та холодна робота'
    ],
    cons: [
      'Вкрай низька продуктивність у найсучасніших ААА-іграх',
      'GDDR5 пам\'ять вже серйозно застаріла'
    ]
  }
];

export const POPULAR_CPUS: CPUComponent[] = [
  {
    id: 'ryzen-7-7800x3d',
    name: 'AMD Ryzen 7 7800X3D',
    brand: 'AMD',
    priceUah: 16499,
    performanceScore: 95,
    valueScore: 96,
    releaseYear: 2023,
    specs: {
      coresThreads: '8 / 16',
      socket: 'AM5',
      baseClock: '4.2 GHz',
      boostClock: '5.0 GHz',
      cacheSize: '96 MB (L3 3D V-Cache)',
      powerTdp: '120W',
      hasIntegratedGraphics: 'Так (AMD Radeon)',
      processNode: '5 nm (TSMC)',
      ramSupport: 'DDR5-5200'
    },
    pros: [
      'Найкращий ігровий процесор у світі завдяки 3D V-Cache',
      'Неймовірно енергоефективний під час ігрових навантажень',
      'Перспективна платформа AM5 з підтримкою майбутніх апгрейдів'
    ],
    cons: [
      'Помірні показники в робочих завданнях порівняно з Core i7/i9',
      'Чутливий до швидкості та таймінгів оперативної пам\'яті DDR5'
    ]
  },
  {
    id: 'ryzen-5-7600x',
    name: 'AMD Ryzen 5 7600X',
    brand: 'AMD',
    priceUah: 9199,
    performanceScore: 68,
    valueScore: 88,
    releaseYear: 2022,
    specs: {
      coresThreads: '6 / 12',
      socket: 'AM5',
      baseClock: '4.7 GHz',
      boostClock: '5.3 GHz',
      cacheSize: '32 MB',
      powerTdp: '105W',
      hasIntegratedGraphics: 'Так (AMD Radeon)',
      processNode: '5 nm (TSMC)',
      ramSupport: 'DDR5-5200'
    },
    pros: [
      'Висока однопотокова продуктивність',
      'Платформа AM5 з DDR5 та PCIe 5.0',
      'Дуже хороша ціна для входу на нове покоління AMD'
    ],
    cons: [
      'Досить гарячий за заводських налаштувань (рекомендується Curve Optimizer)',
      'Вимагає покупки нового кулера (немає боксового у комплекті)'
    ]
  },
  {
    id: 'ryzen-7-5700x3d',
    name: 'AMD Ryzen 7 5700X3D',
    brand: 'AMD',
    priceUah: 9499,
    performanceScore: 74,
    valueScore: 94,
    releaseYear: 2024,
    specs: {
      coresThreads: '8 / 16',
      socket: 'AM4',
      baseClock: '3.0 GHz',
      boostClock: '4.1 GHz',
      cacheSize: '96 MB (L3 3D V-Cache)',
      powerTdp: '105W',
      hasIntegratedGraphics: 'Ні',
      processNode: '7 nm (TSMC)',
      ramSupport: 'DDR4-3200'
    },
    pros: [
      'Найкращий апгрейд для існуючих систем на сокеті AM4',
      '3D V-Cache забезпечує плавний геймплей з мінімальними просадками',
      'Чудова стабільність FPS'
    ],
    cons: [
      'Низька частота ядер впливає на робочі задачі',
      'Стара платформа AM4 (тільки DDR4) — збирати новий ПК з нуля недоцільно'
    ]
  },
  {
    id: 'ryzen-5-5600',
    name: 'AMD Ryzen 5 5600',
    brand: 'AMD',
    priceUah: 4799,
    performanceScore: 45,
    valueScore: 98,
    releaseYear: 2022,
    specs: {
      coresThreads: '6 / 12',
      socket: 'AM4',
      baseClock: '3.5 GHz',
      boostClock: '4.4 GHz',
      cacheSize: '32 MB',
      powerTdp: '65W',
      hasIntegratedGraphics: 'Ні',
      processNode: '7 nm (TSMC)',
      ramSupport: 'DDR4-3200'
    },
    pros: [
      'Абсолютний бюджетний народний улюбленець',
      'Комплектується якісним боксовим кулером у коробці',
      'Дуже низькі температурні вимоги та легкість налаштування'
    ],
    cons: [
      'Платформа AM4 не має майбутніх оновлень наступного покоління',
      'Обмежена продуктивність у важких сучасних онлайн-іграх'
    ]
  },
  {
    id: 'core-i9-14900k',
    name: 'Intel Core i9-14900K',
    brand: 'Intel',
    priceUah: 24499,
    performanceScore: 100,
    valueScore: 55,
    releaseYear: 2023,
    specs: {
      coresThreads: '24 (8P + 16E) / 32',
      socket: 'LGA1700',
      baseClock: '3.2 GHz',
      boostClock: '6.0 GHz',
      cacheSize: '36 MB',
      powerTdp: '125W (Turbo 253W+)',
      hasIntegratedGraphics: 'Так (Intel UHD 770)',
      processNode: '10 nm (Intel 7)',
      ramSupport: 'DDR5-5600 / DDR4-3200'
    },
    pros: [
      'Абсолютний монстр у багатопотокових робочих задачах (рендеринг, компиляція)',
      'Неймовірна рекордна частота до 6.0 GHz "з коробки"',
      'Чудова ігрова продуктивність'
    ],
    cons: [
      'Екстремальне енергоспоживання під навантаженням',
      'Вимагає дорогої преміальної СРО (водяного охолодження) 360/420мм',
      'Платформа LGA1700 завершила свій життєвий цикл'
    ]
  },
  {
    id: 'core-i7-14700k',
    name: 'Intel Core i7-14700K',
    brand: 'Intel',
    priceUah: 17599,
    performanceScore: 88,
    valueScore: 78,
    releaseYear: 2023,
    specs: {
      coresThreads: '20 (8P + 12E) / 28',
      socket: 'LGA1700',
      baseClock: '3.4 GHz',
      boostClock: '5.6 GHz',
      cacheSize: '33 MB',
      powerTdp: '125W (Turbo 250W)',
      hasIntegratedGraphics: 'Так (Intel UHD 770)',
      processNode: '10 nm (Intel 7)',
      ramSupport: 'DDR5-5600 / DDR4-3200'
    },
    pros: [
      'Збільшена кількість енергоефективних ядер у порівнянні з i7-13700K',
      'Майже ідентичний до i9 в іграх, але дешевший',
      'Дуже міцний баланс робота + геймінг'
    ],
    cons: [
      'Виділяє багато тепла, потребує потужної системи охолодження',
      'Високе споживання енергії під лімітами'
    ]
  },
  {
    id: 'core-i5-13600k',
    name: 'Intel Core i5-13600K',
    brand: 'Intel',
    priceUah: 13199,
    performanceScore: 76,
    valueScore: 84,
    releaseYear: 2022,
    specs: {
      coresThreads: '14 (6P + 8E) / 20',
      socket: 'LGA1700',
      baseClock: '3.5 GHz',
      boostClock: '5.1 GHz',
      cacheSize: '24 MB',
      powerTdp: '125W (Turbo 181W)',
      hasIntegratedGraphics: 'Так (Intel UHD 770)',
      processNode: '10 nm (Intel 7)',
      ramSupport: 'DDR5-5600 / DDR4-3200'
    },
    pros: [
      'Один з найкращих універсальних процесорів середнього класу',
      'Відмінний розгінний потенціал',
      'Підтримує як DDR4, так і DDR5 модулі пам\'яті'
    ],
    cons: [
      'Новіші сокети забезпечать довший термін актуальності',
      'Потребує принаймні двосекційної башти або СРО'
    ]
  },
  {
    id: 'core-i5-12400f',
    name: 'Intel Core i5-12400F',
    brand: 'Intel',
    priceUah: 4199,
    performanceScore: 42,
    valueScore: 97,
    releaseYear: 2022,
    specs: {
      coresThreads: '6 / 12',
      socket: 'LGA1700',
      baseClock: '2.5 GHz',
      boostClock: '4.4 GHz',
      cacheSize: '18 MB',
      powerTdp: '65W',
      hasIntegratedGraphics: 'Ні',
      processNode: '10 nm (Intel 7)',
      ramSupport: 'DDR5-4800 / DDR4-3200'
    },
    pros: [
      'Неймовірна бюджетна легенда для ігор',
      'Дуже низькі температури, достатньо недорогого кулера',
      'Величезний вибір недорогих материнських плат H610/B660/B760'
    ],
    cons: [
      'Відсутність розгону та енергоефективних ядер E-Cores',
      'Боксовий кулер буває досить шумним під навантаженням'
    ]
  }
];
