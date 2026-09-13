export type PresetCategory = 'focus' | 'sleep' | 'relax' | 'meditation' | 'recovery';

export interface FrequencyPreset {
  id: string;
  name: string;
  category: PresetCategory;
  frequency: number; // in Hz
  secondaryFrequency?: number; // for binaural (right channel)
  binauralBeat?: number; // target beat in Hz
  waveType: 'sine' | 'triangle' | 'sawtooth' | 'square';
  description: string;
  benefits: string[];
  color: string;
  iconName: string; // Feather icon name
}

export interface BrainwaveBand {
  id: string;
  name: string;
  symbol: string;
  minBeat: number;
  maxBeat: number;
  defaultBeat: number;
  description: string;
  benefits: string;
  color: string;
}

export const BRAINWAVE_BANDS: BrainwaveBand[] = [
  { id: 'delta', name: 'Delta', symbol: 'Î´', minBeat: 0.5, maxBeat: 4.0, defaultBeat: 2.5, description: '0.5 â€“ 4.0 Hz Derin Uyku', benefits: 'Derin uyku, iyileÅŸme', color: '#5E5CE6' },
  { id: 'theta', name: 'Theta', symbol: 'Î¸', minBeat: 4.0, maxBeat: 8.0, defaultBeat: 6.0, description: '4.0 â€“ 8.0 Hz Derin Meditasyon', benefits: 'BilinÃ§altÄ±, rahatlama', color: '#BF5AF2' },
  { id: 'alpha', name: 'Alpha', symbol: 'Î±', minBeat: 8.0, maxBeat: 13.0, defaultBeat: 10.0, description: '8.0 â€“ 13.0 Hz Sakin Odak', benefits: 'AkÄ±ÅŸ, Ã¶ÄŸrenme', color: '#0A84FF' },
  { id: 'beta', name: 'Beta', symbol: 'Î²', minBeat: 13.0, maxBeat: 30.0, defaultBeat: 20.0, description: '13.0 â€“ 30.0 Hz Analitik Zeka', benefits: 'UyanÄ±klÄ±k, problem Ã§Ã¶zme', color: '#FF9F0A' },
  { id: 'gamma', name: 'Gamma', symbol: 'Î³', minBeat: 30.0, maxBeat: 100.0, defaultBeat: 40.0, description: '30.0+ Hz Zirve Performans', benefits: 'BiliÅŸsel sentez, bilinÃ§', color: '#FF453A' },
];

export const ALL_PRESETS: FrequencyPreset[] = [
  // Sleep & Recovery
  { id: 'solf-174', name: 'AÄŸrÄ± Kesici', category: 'recovery', frequency: 174, waveType: 'sine', description: 'Fiziksel gerilimi ve aÄŸrÄ±larÄ± hafifletir', benefits: ['HÃ¼cre yenilenmesi'], color: '#FF453A', iconName: 'activity' },
  { id: 'nat-432', name: 'Evrensel Uyum', category: 'sleep', frequency: 432, waveType: 'sine', description: 'Matematiksel evrensel harmoni', benefits: ['Uyku kalitesi'], color: '#30D158', iconName: 'moon' },
  { id: 'solf-285', name: 'Doku ÅifasÄ±', category: 'recovery', frequency: 285, waveType: 'sine', description: 'HÃ¼cre yenilenmesini uyarÄ±r', benefits: ['Fiziksel iyileÅŸme'], color: '#FF9F0A', iconName: 'heart' },
  
  // Relax & Meditation
  { id: 'solf-396', name: 'Korkudan ArÄ±nma', category: 'relax', frequency: 396, waveType: 'sine', description: 'Gizli korkularÄ± ve endiÅŸeyi temizler', benefits: ['GÃ¼ven hissi'], color: '#FFD60A', iconName: 'wind' },
  { id: 'solf-528', name: 'DNA OnarÄ±mÄ±', category: 'meditation', frequency: 528, waveType: 'sine', description: 'Mucizevi dÃ¶nÃ¼ÅŸÃ¼m ve sevgi frekansÄ±', benefits: ['Stres azaltma'], color: '#32ADE6', iconName: 'zap' },
  { id: 'solf-639', name: 'Kalp BaÄŸlantÄ±sÄ±', category: 'meditation', frequency: 639, waveType: 'sine', description: 'Ä°liÅŸkileri ÅŸifalandÄ±rÄ±r', benefits: ['Empati'], color: '#0A84FF', iconName: 'users' },
  
  // Focus & Higher Mind
  { id: 'solf-741', name: 'Sezgi UyanÄ±ÅŸÄ±', category: 'focus', frequency: 741, waveType: 'sine', description: 'Problem Ã§Ã¶zme ve toksin arÄ±nmasÄ±', benefits: ['Zihinsel netlik'], color: '#5E5CE6', iconName: 'target' },
  { id: 'solf-852', name: 'Ruhsal DÃ¼zen', category: 'focus', frequency: 852, waveType: 'sine', description: 'Ä°Ã§sel vizyonu gÃ¼Ã§lendirir', benefits: ['Net dÃ¼ÅŸÃ¼nce'], color: '#BF5AF2', iconName: 'eye' },
  { id: 'solf-963', name: 'Kozmik BaÄŸ', category: 'meditation', frequency: 963, waveType: 'sine', description: 'En yÃ¼ksek bilinÃ§ frekansÄ±', benefits: ['Birlik hissi'], color: '#FFFFFF', iconName: 'sun' },
];