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
  { id: 'delta', name: 'Delta', symbol: 'δ', minBeat: 0.5, maxBeat: 4.0, defaultBeat: 2.5, description: '0.5 – 4.0 Hz Derin Uyku', benefits: 'Derin uyku, iyileşme', color: '#5E5CE6' },
  { id: 'theta', name: 'Theta', symbol: 'θ', minBeat: 4.0, maxBeat: 8.0, defaultBeat: 6.0, description: '4.0 – 8.0 Hz Derin Meditasyon', benefits: 'Bilinçaltı, rahatlama', color: '#BF5AF2' },
  { id: 'alpha', name: 'Alpha', symbol: 'α', minBeat: 8.0, maxBeat: 13.0, defaultBeat: 10.0, description: '8.0 – 13.0 Hz Sakin Odak', benefits: 'Akış, öğrenme', color: '#0A84FF' },
  { id: 'beta', name: 'Beta', symbol: 'β', minBeat: 13.0, maxBeat: 30.0, defaultBeat: 20.0, description: '13.0 – 30.0 Hz Analitik Zeka', benefits: 'Uyanıklık, problem çözme', color: '#FF9F0A' },
  { id: 'gamma', name: 'Gamma', symbol: 'γ', minBeat: 30.0, maxBeat: 100.0, defaultBeat: 40.0, description: '30.0+ Hz Zirve Performans', benefits: 'Bilişsel sentez, bilinç', color: '#FF453A' },
];

export const ALL_PRESETS: FrequencyPreset[] = [
  // Sleep & Recovery
  { id: 'solf-174', name: 'Ağrı Kesici', category: 'recovery', frequency: 174, waveType: 'sine', description: 'Fiziksel gerilimi ve ağrıları hafifletir', benefits: ['Hücre yenilenmesi'], color: '#FF453A', iconName: 'activity' },
  { id: 'nat-432', name: 'Evrensel Uyum', category: 'sleep', frequency: 432, waveType: 'sine', description: 'Matematiksel evrensel harmoni', benefits: ['Uyku kalitesi'], color: '#30D158', iconName: 'moon' },
  { id: 'solf-285', name: 'Doku Şifası', category: 'recovery', frequency: 285, waveType: 'sine', description: 'Hücre yenilenmesini uyarır', benefits: ['Fiziksel iyileşme'], color: '#FF9F0A', iconName: 'heart' },
  
  // Relax & Meditation
  { id: 'solf-396', name: 'Korkudan Arınma', category: 'relax', frequency: 396, waveType: 'sine', description: 'Gizli korkuları ve endişeyi temizler', benefits: ['Güven hissi'], color: '#FFD60A', iconName: 'wind' },
  { id: 'solf-528', name: 'DNA Onarımı', category: 'meditation', frequency: 528, waveType: 'sine', description: 'Mucizevi dönüşüm ve sevgi frekansı', benefits: ['Stres azaltma'], color: '#32ADE6', iconName: 'zap' },
  { id: 'solf-639', name: 'Kalp Bağlantısı', category: 'meditation', frequency: 639, waveType: 'sine', description: 'İlişkileri şifalandırır', benefits: ['Empati'], color: '#0A84FF', iconName: 'users' },
  
  // Focus & Higher Mind
  { id: 'solf-741', name: 'Sezgi Uyanışı', category: 'focus', frequency: 741, waveType: 'sine', description: 'Problem çözme ve toksin arınması', benefits: ['Zihinsel netlik'], color: '#5E5CE6', iconName: 'target' },
  { id: 'solf-852', name: 'Ruhsal Düzen', category: 'focus', frequency: 852, waveType: 'sine', description: 'İçsel vizyonu güçlendirir', benefits: ['Net düşünce'], color: '#BF5AF2', iconName: 'eye' },
  { id: 'solf-963', name: 'Kozmik Bağ', category: 'meditation', frequency: 963, waveType: 'sine', description: 'En yüksek bilinç frekansı', benefits: ['Birlik hissi'], color: '#FFFFFF', iconName: 'sun' },
];