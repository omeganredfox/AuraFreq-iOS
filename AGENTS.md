# 🤖 AURAFREQ iOS — AGENTS & SQUAD ROLES DIRECTORY

> **Teknoloji & Ortam:** Apple iOS / iPhone (Windows 11 Dev + PC iPhone Simulator + Expo Go Wireless Test + EAS)  
> **Temel Mimari:** React Native + TypeScript + Web Audio & Native DSP Audio Graph  
> **Kural:** Her oturum başında yalnızca `AGENTS.md` ve `PROJECT_STATE.md` okunur. Değiştirilemez snapshot'lar `docs/context/` altında saklanır.

---

## 1. 🛡️ TOKEN DİSİPLİNİ VE HAFIZA SÖZLEŞMESİ (NON-NEGOTIABLE)

1. **Minimum Başlangıç Token Tüketimi:**
   - Bir oturum açıldığında tüm geçmiş konuşmaları veya kaynak kodları baştan sona okumak **KESİNLİKLE YASAKTIR**.
   - Sırasıyla yalnızca şu iki dosya taranır:
     1. `AGENTS.md` (Rol sınırları, sözleşmeler)
     2. `PROJECT_STATE.md` (Güncel durum, test kapıları, aktif görevler)
2. **Küçük ve Odaklı Değişiklikler (Small, Atomic Diffs):**
   - Tek seferde yüzlerce satırlık monolitik kod yazmak yasaktır.
   - Her modül izole edilir; arayüzler ve tipler (interfaces/types) önceden tanımlanır.
3. **Sıfır Varsayım / Sıfır Farazi Tamamlama:**
   - `PROJECT_STATE.md` içinde "Tamamlandı (PASS)" damgası vurulmamış hiçbir özellik tamamlanmış sayılamaz.
   - Test edilmemiş kod asla "çalışıyor" olarak raporlanamaz.
4. **Değiştirilemez Faz Devirleri (Immutable Snapshots):**
   - Her majör faz/milestone bittiğinde `docs/context/Master_Context_v<N>.md` dosyası oluşturulup mühürlenir. Bir daha asla düzenlenemez.

---

## 2. 👥 UZMANLIK ROLLERİ VE SQUAD SORUMLULUK MATRİSİ

| Ajan Rolü | Kimlik & Uzmanlık | Temel Sorumlulukları | Çıktı / Sözleşme (Contract) |
| :--- | :--- | :--- | :--- |
| **`dsp_audio_architect`** | Dijital Sinyal İşleme (DSP) & Akustik Mühendisi | Web Audio API / Native Audio Graph, saf sinüs/üçgen/kare dalga üretimi, stereo kanal ayrımı ($L \neq R$), sıfır patlama/çıtırtı (anti-pop/ramp envelope), frekans hassasiyeti ($\pm 0.05$ Hz). | `IAudioEngine`, `BinauralSynthesizer`, `ToneGenerator` |
| **`apple_hig_designer`** | Apple Human Interface Guidelines UI/UX Mimar | Apple Design Award standartlarında OLED True Black koyu tema, glassmorphic blur, 44x44pt dokunmatik hedefler, Dynamic Island & Kilit ekranı uyumu, Lissajous & akışkan ses dalgası görselleştiricisi. | `AppleTheme`, `WaveVisualizer`, `HapticFeedback` |
| **`ios_platform_engineer`** | React Native & Expo Platform Uzmanı | Windows PC üzerinde iPhone 16 Pro Web Emülatör çerçevesi, Safe Area yönetimi, Expo Go QR canlı test konfigürasyonu, arka planda ses çalma (Background Audio lifecycle). | `App.tsx`, `SimulatorFrame`, `BackgroundAudioHandler` |
| **`presets_curator`** | Rezonans, Solfeggio & Akustik Uzmanı | Solfeggio skalası (174 - 963 Hz), Schumann Rezonansı (7.83 Hz), Beyin dalgası bantları (Delta, Theta, Alpha, Beta, Gamma), Pink/Brown/White noise miksaj matrisi. | `PRESETS_DATA`, `BrainwaveFrequencies` |
| **`qa_test_gatekeeper`** | Test Otomasyon & Zero-Regression Koruyucusu | 100% yeşil test zorunluluğu, DSP matematiksel doğruluk testleri, stereo izolasyon testleri, UI render doğrulama, Jest/TypeScript tip denetimleri. | `RUN_TESTS`, `Zero-Regression Gate` |
| **`security_stability_auditor`** | Ses Güvenliği & Stabilite Denetçisi | İşitme güvenliği (ani yüksek desibel patlamalarını önleyen soft-limiter/compressor), pil ve bellek sızıntısı (memory leak) önleme, audio context temizliği (garbage-free DSP loop). | `AudioLimiter`, `MemoryLeakAudit` |

---

## 3. 🧪 TEST VE KALİTE KAPILARI (QUALITY GATES)

Hiçbir kod parçası şu 4 kapıdan geçmeden `PROJECT_STATE.md` içinde "Bitti" olarak işaretlenemez:
- **Gate 1 (Mathematical Frequency Accuracy):** Üretilen sesin matematiksel frekans sapması $\%0.1$'den az olmalıdır.
- **Gate 2 (Absolute Stereo Isolation):** Binaural modda sol kanaldan çıkan ses sağ kanala sızmamalıdır (Cross-talk = 0.0).
- **Gate 3 (No Click / No Pop Envelope):** Ses başlatılırken veya durdurulurken en az 10ms yumuşak rampa (attack/decay) uygulanmalı; donanımsal hoparlör patlaması engellenmelidir.
- **Gate 4 (Apple HIG & Touch Target):** Dokunulabilir her öğe en az $44 \times 44$ Apple pt boyutunda olmalıdır.

---

## 4. 🔀 GIT VE COMMIT PROTOKOLÜ

Commit mesajları Conventional Commits formatında olacaktır:
- `feat(dsp): add binaural beat frequency calculation engine`
- `fix(audio): eliminate pop on oscillator stop via exponential ramp`
- `style(hig): apply ios 18 blurred material to bottom navigation`
- `test(gates): add stereo isolation and frequency accuracy test cases`