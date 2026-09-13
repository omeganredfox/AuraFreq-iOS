export interface FrequencyPreset {
  id: string;
  name: string;
  category: 'solfeggio' | 'brainwave' | 'natural' | 'custom';
  frequency: number; // in Hz
  secondaryFrequency?: number; // for binaural (right channel)
  binauralBeat?: number; // target beat in Hz
  waveType: 'sine' | 'triangle' | 'sawtooth' | 'square';
  description: string;
  benefits: string[];
  color: string;
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
  {
    id: 'delta',
    name: 'Delta',
    symbol: 'δ',
    minBeat: 0.5,
    maxBeat: 4.0,
    defaultBeat: 2.5,
    description: '0.5 – 4.0 Hz Derin Uyku & Hücresel Yenilenme',
    benefits: 'Ağrısız derin uyku, bağışıklık toparlanması, stres hormonu düşüşü.',
    color: '#5E5CE6',
  },
  {
    id: 'theta',
    name: 'Theta',
    symbol: 'θ',
    minBeat: 4.0,
    maxBeat: 8.0,
    defaultBeat: 6.0,
    description: '4.0 – 8.0 Hz Derin Meditasyon & Sezgi',
    benefits: 'Bilinçaltı rahatlama, yaratıcı ilham, rüya benzeri sakinlik.',
    color: '#BF5AF2',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    symbol: 'α',
    minBeat: 8.0,
    maxBeat: 13.0,
    defaultBeat: 10.0,
    description: '8.0 – 13.0 Hz Sakin Odak & Zihinsel Akış',
    benefits: 'Gerginliksiz odaklanma, çalışma verimliliği, dingin dikkat.',
    color: '#0A84FF',
  },
  {
    id: 'beta',
    name: 'Beta',
    symbol: 'β',
    minBeat: 13.0,
    maxBeat: 30.0,
    defaultBeat: 18.0,
    description: '13.0 – 30.0 Hz Aktif Konsantrasyon & Çözüm',
    benefits: 'Hızlı problem çözme, analitik düşünme, uyanıklık ve canlılık.',
    color: '#30D158',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    symbol: 'γ',
    minBeat: 30.0,
    maxBeat: 60.0,
    defaultBeat: 40.0,
    description: '30.0 – 60.0 Hz Zirve Bilişsel Performans',
    benefits: 'Yüksek algı entegrasyonu, bellek pekiştirme, hiper-farkındalık.',
    color: '#FF9F0A',
  },
];

export const SOLFEGGIO_PRESETS: FrequencyPreset[] = [
  {
    id: 'solf-174',
    name: '174 Hz — Doğal Anestezi & Ağrı Dindirme',
    category: 'solfeggio',
    frequency: 174,
    waveType: 'sine',
    description: 'Fiziksel gerginliği ve ağrı hissini hafifletmeye yardımcı olur.',
    benefits: ['Hücresel rahatlama', 'Ağrı hissini hafifletme', 'Güven duygusu'],
    color: '#64D2FF',
  },
  {
    id: 'solf-285',
    name: '285 Hz — Doku Yenilenmesi & Bütünlük',
    category: 'solfeggio',
    frequency: 285,
    waveType: 'sine',
    description: 'Vücudun doğal ritmini ve enerji alanını yeniden dengeler.',
    benefits: ['Doku onarım sinyali', 'Halsizlik giderme', 'Dinamizm'],
    color: '#5AC8FA',
  },
  {
    id: 'solf-396',
    name: '396 Hz — Korku & Suçluluktan Arınma',
    category: 'solfeggio',
    frequency: 396,
    waveType: 'sine',
    description: 'Kök çakra uyumu ile endişe ve tıkanıklıkları dağıtır.',
    benefits: ['Negatif düşünce temizliği', 'Güvende hissetme', 'Köklenme'],
    color: '#FF453A',
  },
  {
    id: 'solf-417',
    name: '417 Hz — Değişimi Kolaylaştırma',
    category: 'solfeggio',
    frequency: 417,
    waveType: 'sine',
    description: 'Döngüleri kırmak ve yeni başlangıçlar için zihni hazırlar.',
    benefits: ['Eski alışkanlıkları aşma', 'Duygusal detoks', 'Uyum sağlama'],
    color: '#FF9F0A',
  },
  {
    id: 'solf-528',
    name: '528 Hz — Mucize Frekansı & DNA Onarımı',
    category: 'solfeggio',
    frequency: 528,
    waveType: 'sine',
    description: 'Doğanın kalp atışı, dönüşüm ve derin iç huzur frekansı.',
    benefits: ['Derin hücresel harmoni', 'Stres azaltma', 'Kalp merkezli sevgi'],
    color: '#30D158',
  },
  {
    id: 'solf-639',
    name: '639 Hz — İlişkiler & Empati Bağı',
    category: 'solfeggio',
    frequency: 639,
    waveType: 'sine',
    description: 'İletişimi, şefkati ve sosyal uyumu güçlendirir.',
    benefits: ['Sosyal empati artışı', 'Affetme kolaylığı', 'İçsel barış'],
    color: '#34C759',
  },
  {
    id: 'solf-741',
    name: '741 Hz — Sezgi & Öz İfade',
    category: 'solfeggio',
    frequency: 741,
    waveType: 'sine',
    description: 'Boğaz çakrası uyarımı; kendini açıkça ifade etme ve netlik.',
    benefits: ['Zihinsel berraklık', 'Toksin arındırma', 'Özgüven'],
    color: '#0A84FF',
  },
  {
    id: 'solf-852',
    name: '852 Hz — Ruhsal Denge & İçgörü',
    category: 'solfeggio',
    frequency: 852,
    waveType: 'sine',
    description: 'Üçüncü göz algısı; illüzyonlardan sıyrılma ve derin sezgi.',
    benefits: ['Bilişsel derinlik', 'Meditasyon derinleşmesi', 'İç rehberlik'],
    color: '#5E5CE6',
  },
  {
    id: 'solf-963',
    name: '963 Hz — Saf Bilinç & Taç Çakra',
    category: 'solfeggio',
    frequency: 963,
    waveType: 'sine',
    description: 'Bütünsel birlik hissi ve zihnin en saf uyanıklık hali.',
    benefits: ['Üst bilinç aktivasyonu', 'Sonsuzluk hissi', 'Huzur'],
    color: '#BF5AF2',
  },
];

export const NATURAL_PRESETS: FrequencyPreset[] = [
  {
    id: 'nat-schumann',
    name: '7.83 Hz — Schumann Rezonansı (Dünya Kalbi)',
    category: 'natural',
    frequency: 7.83,
    secondaryFrequency: 7.83,
    binauralBeat: 7.83,
    waveType: 'sine',
    description: 'Dünyanın elektromanyetik boşluğunun temel titreşim ritmidir.',
    benefits: ['Topraklanma (Grounding)', 'Sirkadiyen ritim uyumu', 'Elektromanyetik denge'],
    color: '#30D158',
  },
  {
    id: 'nat-432',
    name: '432 Hz — Evrensel Akort (Verdi Akordu)',
    category: 'natural',
    frequency: 432,
    waveType: 'sine',
    description: 'Standart 440 Hz yerine doğanın altın oranına uygun akustik akort.',
    benefits: ['Daha sıcak akustik ton', 'Kulak yormayan tını', 'Doğal rezonans'],
    color: '#FFD60A',
  },
];