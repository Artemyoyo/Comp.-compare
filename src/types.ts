export interface BaseComponent {
  id: string;
  name: string;
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  priceUah: number;
  performanceScore: number; // 1 to 100 rating
  valueScore: number; // 1 to 100 price/performance rating (computed or hardcoded)
  releaseYear: number;
  specs: Record<string, string | number>;
  pros: string[];
  cons: string[];
}

export interface GPUComponent extends BaseComponent {
  specs: {
    memorySize: string; // e.g. "12 GB"
    memoryType: string; // e.g. "GDDR6X"
    busWidth: string; // e.g. "192-bit"
    powerTdp: string; // e.g. "200W"
    chipset: string; // e.g. "Ada Lovelace"
    recommendedPsu: string; // e.g. "550W"
    directX: string; // e.g. "12 Ultimate"
    memorySpeed?: string; // e.g. "21 Gbps" or "504 GB/s"
  };
}

export interface CPUComponent extends BaseComponent {
  specs: {
    coresThreads: string; // e.g. "8 / 16"
    socket: string; // e.g. "AM5"
    baseClock: string; // e.g. "4.2 GHz"
    boostClock: string; // e.g. "5.0 GHz"
    cacheSize: string; // e.g. "96 MB"
    powerTdp: string; // e.g. "120W"
    hasIntegratedGraphics: string; // e.g. "Так" "Ні"
    processNode?: string; // e.g. "5 nm"
    ramSupport?: string; // e.g. "DDR5-5200"
  };
}

export interface AIComparisonResult {
  verdict: string;
  performanceDetails: string;
  valueReview: string;
  winner: string;
  recommendation: string;
}
