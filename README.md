# 🎧 AuraFreq iOS — Pure Tone & Binaural Sound Therapy

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Apple%20iOS%2018-000000?style=for-the-badge&logo=apple)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20%2F%20Expo-000020?style=for-the-badge&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)
![Audio Engine](https://img.shields.io/badge/Audio-Web%20Audio%20%26%20DSP-FF9F0A?style=for-the-badge)
![Quality Gates](https://img.shields.io/badge/Quality%20Gates-4%2F4%20PASS-30D158?style=for-the-badge)
![Zero Regression](https://img.shields.io/badge/Tests-10%2F10%20Green-30D158?style=for-the-badge)

<p align="center">
  <b>0.1 Hz Hassasiyetli Saf Frekans Jeneratörü • Binaural Beyin Dalgası Laboratuvarı • Kadim Solfeggio & Doğal Şifa Frekansları • Renkli Gürültü Ambiyans Mikseri</b>
</p>

[Mühendislik Omurgası (AGENTS.md)](./AGENTS.md) • [Tek Doğruluk Kaynağı (PROJECT_STATE.md)](./PROJECT_STATE.md) • [Ses Spesifikasyonu](./docs/specs/AUDIO_DSP_SPEC.md) • [Apple HIG Tasarımı](./docs/specs/APPLE_HIG_DESIGN.md)

</div>

---

## 🌟 ÖNE ÇIKAN ÖZELLİKLER

### 1. 🎛️ Saf Frekans Sentezleyici (Tone Generator)
* **0.1 Hz Hassasiyet:** 20 Hz ile 20.000 Hz arasında kullanıcı tanımlı saf frekans üretimi.
* **4 Dalga Formu:** Harmoniksiz saf sinüs (Sine), yumuşak üçgen (Triangle), enerjik testere (Sawtooth) ve kare (Square).
* **0 Pop / 0 Çıtırtı Garantisi:** Hoparlörleri ve kulak sağlığını koruyan 30ms yumuşak rampa (S-curve envelope) ve DynamicsCompressor güvenlik sınırlayıcısı.

### 2. 🧠 Binaural Beyin Dalgaları (Binaural Beats Lab)
* İki kulak arasına gönderilen bağımsız mikro-frekans farkıyla beynin frekans takibi tepkisini (Frequency Following Response) uyarır:
  * **Delta (0.5 – 4.0 Hz):** Derin rüyasız uyku, hücresel yenilenme.
  * **Theta (4.0 – 8.0 Hz):** Derin meditasyon, sezgi, yaratıcı akış.
  * **Alpha (8.0 – 13.0 Hz):** Sakin uyanıklık, hafif odak, sınav/çalışma dinginliği.
  * **Beta (13.0 – 30.0 Hz):** Yüksek konsantrasyon, analitik düşünme, uyanıklık.
  * **Gamma (30.0 – 60.0 Hz):** Zirve bilişsel entegrasyon, hiper-farkındalık.
* **Mutlak Stereo İzolasyonu:** Sol ve sağ kulak kanalları `ChannelMergerNode(2)` ile tamamen ayrıştırılmıştır (Cross-talk = 0.0).

### 3. ✨ Kadim Solfeggio & Doğal Rezonanslar
* **9 Solfeggio Frekansı:** 174 Hz (Ağrı dindirme), 285 Hz (Doku onarımı), 396 Hz (Korkulardan arınma), 417 Hz (Değişim), 528 Hz ("Aşk & DNA Mucizesi"), 639 Hz (Empati), 741 Hz (Sezgi), 852 Hz (Ruhsal denge), 963 Hz (Saf bilinç).
* **Schumann Rezonansı (7.83 Hz):** Dünyanın iyonosferik kalp atışı (Topraklanma / Grounding).
* **432 Hz Evrensel Akort:** Doğanın altın oranıyla uyumlu Verdi akordu.

### 4. 🌧️ Sentetik Renkli Gürültü Mikseri & Uyku Zamanlayıcısı
* Pembe Gürültü (Pink Noise - $1/f$), Kahverengi Gürültü (Brown Noise - $1/f^2$), Beyaz Gürültü (White Noise).
* 15, 30, 45 ve 60 dakikalık otomatik ses solmalı (fade-out) Uyku Zamanlayıcısı.

---

## 💻 GELİŞTİRME & TEST STRATEJİSİ (WINDOWS 11)

AuraFreq, Mac donanımı gerekmeksizin Windows PC üzerinde tam donanımlı geliştirilebilir ve test edilebilir:

```
+-------------------------------------------------------------+
|               AuraFreq Çift Yönlü Test Ortamı              |
+-------------------------------------------------------------+
                              |
        +---------------------+---------------------+
        |                                           |
        v                                           v
[ PC Ekranı Simülatörü ]               [ Gerçek iPhone (Kablosuz) ]
• iPhone 16 Pro Çerçevesi              • Expo Go ile QR Kod Tarama
• Dynamic Island & Safe Area           • AirPods / Kablosuz Kulaklık
• Web Audio ile Canlı DSP              • Fiziksel Stereo Dinleme
```

---

## 🚀 HIZLI BAŞLANGIÇ

### 1. PC Simülatörünü Başlatma
Doğrudan [`START-AURAFREQ-SIMULATOR.bat`](./START-AURAFREQ-SIMULATOR.bat) dosyasına çift tıklayın veya:
```bash
npm run web
```
Tarayıcınızda (`http://localhost:8081`) iPhone 16 Pro mockup çerçevesi içinde anında çalışır.

### 2. Gerçek iPhone'da Kablosuz Test (Expo Go)
[`START-EXPO-WIRELESS-QR.bat`](./START-EXPO-WIRELESS-QR.bat) dosyasına çift tıklayın veya:
```bash
npm start
```
Terminalde çıkan QR kodu iPhone kameranızla okutun; uygulama anında cihazınızda açılır.

### 3. Otomatik Test Süitini Çalıştırma
[`RUN-TEST-SUITE.bat`](./RUN-TEST-SUITE.bat) dosyasına çift tıklayın veya:
```bash
npm test
npm run typecheck
```

---

## 🧪 KALİTE VE KABUL KAPILARI (ZERO-REGRESSION)

Tüm kod değişiklikleri aşağıdaki 4 katı kapıdan %100 yeşil geçmek zorundadır:

| Kapı | Açıklama | Tolerans Sınırı | Durum |
| :--- | :--- | :--- | :--- |
| **Gate 1** | Matematiksel Frekans Doğruluğu | $\le \pm 0.1\%$ sapma | 🟢 PASS |
| **Gate 2** | Binaural Stereo İzolasyonu ($L \neq R$) | 0.0 cross-talk sızıntısı | 🟢 PASS |
| **Gate 3** | Anti-Pop Yumuşak Rampa Zarfı | $\ge 15$ ms soft attack/decay | 🟢 PASS |
| **Gate 4** | Apple HIG Dokunmatik Alanları | $\ge 44 \times 44$ pt & OLED Black | 🟢 PASS |

---

## 📂 DİZİN YAPISI

```
AuraFreq-iOS/
├── AGENTS.md                   # 6 Uzmanlık Rolü, Sözleşmeler & Token Disiplini
├── PROJECT_STATE.md            # Tek Doğruluk Kaynağı (Single Source of Truth)
├── docs/
│   ├── context/
│   │   └── Master_Context_v0.md # Dondurulmuş Başlangıç Snapshot'ı
│   └── specs/
│       ├── AUDIO_DSP_SPEC.md   # Akustik ve DSP Spesifikasyonu
│       └── APPLE_HIG_DESIGN.md # Apple Tasarım Standartları Spesifikasyonu
├── src/
│   ├── audio/                  # Web Audio & Native DSP Sentezleyici & Matematik
│   │   ├── __tests__/          # Quality Gates Test Süiti
│   │   ├── binauralMath.ts     # Frekans & Beyin Dalgası Hesaplayıcı
│   │   ├── dspEngine.ts        # Çekirdek Audio Graph Sentezleyicisi
│   │   └── types.ts            # Tip Tanımları
│   ├── components/             # Apple HIG Bileşenleri & iPhone Simülatörü
│   │   ├── AudioVisualizer.tsx # Canlı Akışkan Ses Dalgası Görselleştiricisi
│   │   └── iPhoneSimulator.tsx # iPhone 16 Pro Web Çerçevesi & Dynamic Island
│   ├── constants/
│   │   └── presets.ts          # Solfeggio, Schumann & Beyin Dalgaları Veri Tabanı
│   ├── screens/                # Saf Ton, Binaural ve Şifa Preset Ekranları
│   └── theme/                  # Apple OLED True Black Renk ve Tipografi Tokenları
├── package.json
├── tsconfig.json
├── START-AURAFREQ-SIMULATOR.bat# Tek Tıkla PC Simülatör Başlatıcı
├── START-EXPO-WIRELESS-QR.bat  # Tek Tıkla iPhone QR Başlatıcı
└── RUN-TEST-SUITE.bat          # Tek Tıkla Test Çalıştırıcı
```

---

## 📜 LİSANS
MIT License.