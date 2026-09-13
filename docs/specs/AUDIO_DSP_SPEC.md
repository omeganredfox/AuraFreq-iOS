# 🎧 AURAFREQ — AUDIO DSP & BINAURAL ENGINE SPECIFICATION

> **Modül:** Sinyal İşleme, Saf Ton Sentezleyici, Binaural Vuruşlar & Gürültü Jeneratörü  
> **Standart:** Web Audio API & Native Audio Graph (Cross-Platform iOS/Web)  

---

## 1. 🧮 MATEMATİKSEL TEMELLER

### 1.1. Saf Dalga Sentezi (Tone Generation)
Bir ses dalgasının zaman $t$ içerisindeki anlık genliği:
$$y(t) = A(t) \cdot \sin(2\pi f t + \phi)$$
- $f \in [1.0, 20000.0]$ Hz: Hedef frekans (0.1 Hz hassasiyet).
- $A(t) \in [0.0, 1.0]$: Genlik (Envelope rampa fonksiyonu ile kontrol edilir).
- Desteklenen Dalga Formları:
  - **Sine (Saf Sinüs):** Harmoniksiz, en sakin ve şifalandırıcı dalga formu.
  - **Triangle (Üçgen):** Yumuşak tek harmonikler, zengin ama pürüzsüz.
  - **Sawtooth (Testere):** Tüm harmonikler, enerjik ve keskin.
  - **Square (Kare):** Güçlü tek harmonikler, izokronik vuruşlar için ideal.

### 1.2. Binaural Beats (Çift Kulak Vuruşları)
Binaural vuruş, iki kulağa hafif farklı frekanslar dinletildiğinde beynin Superior Olivary Complex bölgesinde oluşan algısal frekans farkıdır:
- Taşıyıcı Frekans: $f_c$ (Örn. 216 Hz)
- Hedef Beyin Dalgası Farkı: $\Delta f$ (Örn. 10 Hz Alpha)
- Sol Kanal: $f_L = f_c - \frac{\Delta f}{2}$
- Sağ Kanal: $f_R = f_c + \frac{\Delta f}{2}$

#### Beyin Dalgası Frekans Bantları:
| Bant Adı | Frekans Aralığı ($\Delta f$) | Zihinsel Durum / Terapötik Etki |
| :--- | :--- | :--- |
| **Delta ($\delta$)** | $0.5 - 4.0\text{ Hz}$ | Derin rüyasız uyku, ağrı dindirme, bağışıklık yenileme. |
| **Theta ($\theta$)** | $4.0 - 8.0\text{ Hz}$ | Derin meditasyon, sezgi, yaratıcılık, REM evresi. |
| **Alpha ($\alpha$)** | $8.0 - 13.0\text{ Hz}$ | Sakin odaklanma, hafif uyanıklık, stres ve anksiyete azaltma. |
| **Beta ($\beta$)** | $13.0 - 30.0\text{ Hz}$ | Yüksek konsantrasyon, analitik problem çözme, uyanıklık. |
| **Gamma ($\gamma$)** | $30.0 - 100.0\text{ Hz}$ | Zirve bilişsel performans, hızlı öğrenme, bellek entegrasyonu. |

---

## 2. 🎛️ AUDIO GRAPH VE KANAL MİMARİSİ

```
                     [ Oscillator Left (fL) ] ---> [ Gain Left ] ---\
                                                                      ---> [ ChannelMerger (2-ch) ] ---> [ Master Gain ] ---> [ DynamicsCompressor ] ---> [ Destination ]
                     [ Oscillator Right (fR) ] --> [ Gain Right ] ---/
                                                                      ^
                     [ Noise Generator ] --------> [ Noise Gain ] ---/
```

### 2.1. Mutlak Stereo İzolasyonu (Gate 2)
Sol osilatör yalnızca ChannelMerger'ın 0 numaralı girişine (Left), sağ osilatör yalnızca 1 numaralı girişine (Right) bağlanır. Kanallar arasında sızıntı ($L \to R$ veya $R \to L$) matematiksel olarak 0.0'dır.

### 2.2. Patlama/Çıtırtı Engelleme (Anti-Pop Envelope - Gate 3)
Osilatörler aniden açılıp kapatıldığında hoparlör membranında DC sıçraması (pop/click) oluşur. Bunu engellemek için:
- **Attack Ramp:** 0.0 $\to$ Target Gain (süre: $\ge 20$ ms `linearRampToValueAtTime`)
- **Release Ramp:** Current Gain $\to$ 0.0001 (süre: $\ge 25$ ms `exponentialRampToValueAtTime`)
- Frekans geçişlerinde anlık atlama yerine yumuşak geçiş (`setTargetAtTime`, $\tau = 0.03\text{s}$).

### 2.3. Dinamik Sıkıştırma ve İşitme Güvenliği (Audio Safety)
- `DynamicsCompressorNode`:
  - Threshold: `-6.0 dB`
  - Knee: `12.0 dB`
  - Ratio: `12.0`
  - Attack: `0.003 s`
  - Release: `0.25 s`
- Maksimum çıkış seviyesi asla $0\text{ dBFS}$ sınırını aşamaz (Distorsiyon / Kırpılma engellenir).

---

## 3. 🌿 PRESET VE REZONANS MATRİSİ

1. **Solfeggio Frekansları:**
   - 174 Hz — Anestezi & Ağrı Dindirme
   - 285 Hz — Doku Yenilenmesi & Bütünlük
   - 396 Hz — Korku & Suçluluktan Kurtulma
   - 417 Hz — Değişimi Kolaylaştırma & Travma Çözümü
   - 528 Hz — Mucize, Dönüşüm & DNA Onarımı
   - 639 Hz — İlişkiler, Uyum & Kalp Bağlantısı
   - 741 Hz — Sezgi & Öz İfade
   - 852 Hz — Ruhsal Denge & Saf Sevgi
   - 963 Hz — Yüksek Bilinç & Taç Çakra
2. **Doğal Rezonanslar:**
   - 7.83 Hz — Schumann Rezonansı (İyonosfer ile Dünya Yüzeyi Arasındaki Temel Nabız)
   - 432 Hz — Evrensel Doğal Akort (A4 = 432 Hz)
3. **Renkli Gürültüler (Noise):**
   - **Pink Noise ($1/f$):** Eşit oktav enerjisi, insan kulağı için en dinlendirici gürültü.
   - **Brown Noise ($1/f^2$):** Derin, tok şelale sesi, hiperaktivite ve ADHD için ideal.
   - **White Noise (Düz):** Tüm frekanslarda eşit güç, dış sesleri maskeleme.