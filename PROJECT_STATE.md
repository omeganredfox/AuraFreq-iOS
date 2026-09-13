# 📊 AURAFREQ iOS — SINGLE SOURCE OF TRUTH (PROJECT_STATE.md)

> **Son Güncelleme:** 2026-09-13T21:55:00+03:00  
> **Proje Versiyonu:** v0.1.0-alpha  
> **Geliştirme Ortamı:** Windows 11 PC (Ryzen 7 9850X3D, RTX 5080, 64GB RAM)  
> **Hedef Platform:** Apple iOS (iPhone) / Web Audio Simulation  
> **Teknoloji Yığını:** React Native + Expo (TypeScript) + Web Audio API / Native DSP  
> **GitHub Repo:** [https://github.com/omeganredfox/AuraFreq-iOS](https://github.com/omeganredfox/AuraFreq-iOS)  
> **Canlı Web / Test Sayfası (GitHub Pages):** [https://omeganredfox.github.io/AuraFreq-iOS/](https://omeganredfox.github.io/AuraFreq-iOS/)  

---

## 🎯 GÜNCEL DURUM ÖZETİ (CURRENT PHASE)
* **Aktif Faz:** `Milestone 1: DSP Sentezleyici, UI & GitHub Dağıtımı (TAMAMLANDI)`
* **Genel İlerleme:** %45
* **Test Durumu:** 10/10 Test %100 YEŞİL (PASS)
* **Derleme Durumu:** `tsc --noEmit` 0 Hata, Metro Web Bundler 0 Hata
* **GitHub & Pages Durumu:** Aktif, Canlıda Yayınlandı (Status: BUILT)
* **Blokajlar:** Yok.

---

## 🚦 FAZ VE MİLESTONE DURUMLARI

| Milestone | Kapsam / Hedef | Durum | Kalite Kapısı |
| :--- | :--- | :--- | :--- |
| **Milestone 0** | Hafıza omurgası (`AGENTS.md`, `PROJECT_STATE.md`, `Master_Context_v0.md`), Node.js LTS v24, Expo & Web iPhone Simülatör iskeleti | 🟢 COMPLETED | PASS (Derleme & Ortam) |
| **Milestone 1** | DSP Ses Çekirdeği: Saf Sinüs/Üçgen Dalga Jeneratörü, $0.1$ Hz hassasiyet, Binaural Stereo Ayrımı ($L \neq R$), Anti-Pop Rampa | 🟢 COMPLETED | Gate 1 & Gate 2 & Gate 3 PASS |
| **Milestone 2** | Preset Kütüphanesi: Solfeggio Frekansları (174-963 Hz), Schumann (7.83 Hz), Beyin Dalgaları (Delta-Gamma), Renkli Gürültüler (Pink/Brown/White) | 🟢 COMPLETED | Akustik & Veri Doğruluk PASS |
| **Milestone 3** | Apple HIG Arayüz: iPhone 16 Pro Web Çerçevesi (Dynamic Island), Haptik Kadran/Stepper, OLED True Black, Akışkan Dalga Görselleştiricisi | 🟢 COMPLETED | Gate 4 (44pt+ HIG Target) PASS |
| **Milestone 4** | Apple Yerel Özellikler: Arka Planda Çalma (Background Audio), Kilit Ekranı Now Playing, Uyku Zamanlayıcısı (Sleep Timer & Fade-out) | 🟡 IN PROGRESS | Temel Timer Hazır, Native Background Genişletilecek |
| **Milestone 5** | %100 Yeşil Test Paketi (Zero-Regression Gate), Tek Tıkla Başlatıcılar (.bat), GitHub Repo & GitHub Pages Dağıtımı | 🟢 COMPLETED | 4/4 GATE %100 PASS |

---

## 🧪 KALİTE VE KABUL KAPILARI MATRİSİ (QUALITY GATES)

- [x] **Gate 1 - Matematiksel Frekans Doğruluğu:** Frekans sapması $\le \pm 0.1\%$ (PASS - 10/10 Test)
- [x] **Gate 2 - Binaural Stereo İzolasyonu:** Sol/Sağ kulak cross-talk $= 0.0$ (PASS - Bağımsız ChannelMerger kanalları)
- [x] **Gate 3 - Anti-Pop / Yumuşak Zarf:** 30ms attack/decay ramp (hoparlör ve kulak koruma - PASS)
- [x] **Gate 4 - Apple HIG & Erişilebilirlik:** Dokunmatik hedefler $\ge 44 \times 44$ pt, OLED True Black (#000000) (PASS)

---

## 📝 EN SON YAPILANLAR (COMPLETED WORK)
1. [x] Node.js LTS v24.19.0 Windows 11 ortamına winget ile kuruldu.
2. [x] `AGENTS.md` (Squad rolleri, token disiplini, sözleşmeler) ve `PROJECT_STATE.md` oluşturuldu.
3. [x] `docs/context/Master_Context_v0.md` başlangıç snapshot'ı mühürlendi.
4. [x] `docs/specs/AUDIO_DSP_SPEC.md` ve `docs/specs/APPLE_HIG_DESIGN.md` yazıldı.
5. [x] Saf frekans ve binaural matematik çekirdeği (`src/audio/binauralMath.ts`) kodlandı.
6. [x] Web Audio DSP Sentezleyicisi (`src/audio/dspEngine.ts`) yazıldı.
7. [x] Solfeggio 9 frekanslık ve doğal frekanslar kütüphanesi (`src/constants/presets.ts`) tanımlandı.
8. [x] PC iPhone 16 Pro Web Simülatör kabuğu (`src/components/iPhoneSimulator.tsx`) oluşturuldu.
9. [x] Apple HIG ekranları (`ToneLabScreen`, `BinauralLabScreen`, `PresetsScreen`) kodlandı.
10. [x] Jest test süiti yazıldı ve 10/10 test %100 yeşil doğrulandı.
11. [x] Tek tıkla başlatma bat dosyaları (`START-AURAFREQ-SIMULATOR.bat`, `START-EXPO-WIRELESS-QR.bat`, `RUN-TEST-SUITE.bat`) hazırlandı.
12. [x] GitHub üzerinde `omeganredfox/AuraFreq-iOS` reposu açıldı ve tüm kaynak kodlar ile dokümanlar `main` branch'ine push edildi.
13. [x] GitHub Pages aktif edildi ve canlı web simülatörü `https://omeganredfox.github.io/AuraFreq-iOS/` adresine yayınlandı.