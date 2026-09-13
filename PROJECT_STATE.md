# 📊 AURAFREQ iOS — SINGLE SOURCE OF TRUTH (PROJECT_STATE.md)

> **Son Güncelleme:** 2026-09-13T22:14:00+03:00  
> **Proje Versiyonu:** v0.2.0 (Faz 2 Tamamlandı)  
> **Geliştirme Ortamı:** Windows 11 PC (Ryzen 7 9850X3D, RTX 5080, 64GB RAM)  
> **Hedef Platform:** Apple iOS (iPhone) / Web Audio Simulation  
> **Teknoloji Yığını:** React Native + Expo (TypeScript) + Web Audio API / Native DSP  
> **GitHub Repo:** [https://github.com/omeganredfox/AuraFreq-iOS](https://github.com/omeganredfox/AuraFreq-iOS)  
> **Canlı Web / Test Sayfası (GitHub Pages):** [https://omeganredfox.github.io/AuraFreq-iOS/](https://omeganredfox.github.io/AuraFreq-iOS/)  

---

## 🎯 GÜNCEL DURUM ÖZETİ (CURRENT PHASE)
* **Aktif Faz:** `Faz 2: Çoklu Ses Katmanlama, İzokronik Tonlar & Doğa Ambiyansı (TAMAMLANDI)`
* **Sıradaki Faz:** `Faz 3: Apple HIG Lüks Kadran & Lissajous Rezonans Görselleştiricisi`
* **Genel İlerleme:** %65
* **Test Durumu:** 13/13 Test %100 YEŞİL (PASS)
* **Derleme Durumu:** `tsc --noEmit` 0 Hata, Metro Web Bundler 0 Hata (199 modül)
* **GitHub & Pages Durumu:** Aktif, Canlıda Yayınlandı
* **Blokajlar:** Yok.

---

## 🚦 FAZ VE MİLESTONE DURUMLARI

| Milestone | Kapsam / Hedef | Durum | Kalite Kapısı |
| :--- | :--- | :--- | :--- |
| **Faz 1 (M1)** | Hafıza omurgası (`AGENTS.md`, `PROJECT_STATE.md`, `Master_Context_v0.md`), Node.js LTS v24, Web iPhone Simülatörü, GitHub Repo & Pages | 🟢 COMPLETED | PASS (Master_Context_v1.md donduruldu) |
| **Faz 2 (M2)** | Çoklu Katman Mikseri (Saf Ton + Beyin + Doğa), Kulaklıksız İzokronik Tonlar, Sentetik Yağmur & Okyanus Dalgaları, 3 Bağımsız Ses Yolu | 🟢 COMPLETED | 13/13 Test %100 PASS |
| **Faz 3 (M3)** | Apple HIG Arayüz: 2D Lissajous Akışkan Rezonans Görselleştiricisi, Dairesel Apple Haptik Kadran (Rotary Dial), Dynamic Island animasyonu | ⚪ READY TO START | Gate 4 (44pt+ HIG Target) |
| **Faz 4 (M4)** | Apple Yerel Güçler: Arka Planda Çalma (Background Audio), Kilit Ekranı Now Playing, Logaritmik Fade-Out ve Cihaz İçi Yerel Reçete AI | ⚪ QUEUED | iOS Lifecycle & On-Device AI |
| **Faz 5 (M5)** | %100 Yeşil E2E Test Paketi (Zero-Regression Gate), EAS Build (.ipa), TestFlight Hazırlığı | ⚪ QUEUED | Son Sürüm Mührü (vFinal) |

---

## 🧪 KALİTE VE KABUL KAPILARI MATRİSİ (QUALITY GATES)

- [x] **Gate 1 - Matematiksel Frekans Doğruluğu:** Frekans sapması $\le \pm 0.1\%$ (PASS - 13/13 Test)
- [x] **Gate 2 - Binaural Stereo İzolasyonu:** Sol/Sağ kulak cross-talk $= 0.0$ (PASS - Bağımsız ChannelMerger)
- [x] **Gate 3 - Anti-Pop / Yumuşak Zarf:** 30ms attack/decay ramp (hoparlör ve kulak koruma - PASS)
- [x] **Gate 4 - Apple HIG & Erişilebilirlik:** Dokunmatik hedefler $\ge 44 \times 44$ pt, OLED True Black (#000000) (PASS)
- [x] **Faz 2 Ek Kapı - İzokronik Doğruluk:** Kulaklıksız genlik nabız modülasyonu ($0.5 - 60$ Hz) & çoklu mikser ses sınırı koruması (PASS)

---

## 📝 EN SON YAPILANLAR (COMPLETED WORK)
1. [x] `docs/context/Master_Context_v1.md` mühürlendi ve donduruldu.
2. [x] İzokronik ton motoru (`calculateIsochronicPulse`) kodlandı (Kulaklık zorunluluğu olmadan mono hoparlörde ritmik beyin dalgası uyarma).
3. [x] 3-Bus Çoklu Katmanlama Ses Motoru (`src/audio/dspEngine.ts`) yazıldı:
   - Katman 1: Saf Ton / Solfeggio Bus
   - Katman 2: Beyin Dalgası Uyarımı (Binaural veya İzokronik switch)
   - Katman 3: Doğa Ambiyansı (Pembe, Kahverengi, Beyaz, Yağmur, Okyanus)
4. [x] Prosedürel Sentetik Doğa Sesleri:
   - Yağmur (Rain): Filtrelenmiş pembe gürültü + 800Hz high-pass akustik yağmur rezonansı.
   - Okyanus Dalgaları (Ocean Waves): 12 saniyelik ultra yavaş LFO ile filtrelenen ve kıyıya vuran ritmik dalga simülasyonu.
5. [x] `MixerScreen.tsx` stüdyo mikser konsolu kodlandı ve 4 sekmeli Apple HIG alt navigasyon barına entegre edildi.
6. [x] Jest test süiti 13 teste genişletildi ve 13/13 %100 yeşil doğrulandı.
7. [x] `npx tsc --noEmit` ile 0 tip hatası ve Metro Web Bundler ile 0 derleme hatası doğrulandı.
8. [x] Canlı GitHub Pages simülatörü (`https://omeganredfox.github.io/AuraFreq-iOS/`) Faz 2 ile güncellendi.