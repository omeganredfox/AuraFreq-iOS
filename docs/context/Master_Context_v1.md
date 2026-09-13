# 📜 MASTER CONTEXT v1 — AURAFREQ iOS FAZ 1 DEVİR SNAPSHOT'I (IMMUTABLE)

> **Tarih:** 2026-09-13T22:07:00+03:00  
> **Durum:** MÜHÜRLÜ / DEĞİŞTİRİLEMEZ (LOCKED)  
> **Faz:** Milestone 1 - Temel Altyapı, Web Audio DSP Çekirdeği, iPhone Simülatörü ve Dağıtım  

---

## 1. 📌 TAMAMLANAN MİMARİ VE KAZANIMLAR
- **Hafıza & Disiplin Omurgası:** `AGENTS.md` (6 Squad Uzmanlık Rolü), `PROJECT_STATE.md` (Single Source of Truth), `Master_Context_v0.md`.
- **Geliştirme Ortamı:** Windows 11 PC üzerinde Node.js LTS v24.19.0, React Native + Expo (TypeScript).
- **DSP Ses Çekirdeği:**
  - $0.1$ Hz frekans hassasiyeti (20 Hz - 20.000 Hz).
  - Saf Sinüs, Üçgen, Testere ve Kare dalga formları.
  - `ChannelMergerNode(2)` ile bağımsız Sol ve Sağ kulak frekans ayrımı ($L \ne R$, sıfır cross-talk sızıntısı).
  - Donanımsal ve işitsel koruma: 30ms anti-pop rampa (S-curve) ve DynamicsCompressor ses sınırlayıcısı.
  - Pembe (Pink), Kahverengi (Brown) ve Beyaz (White) sentetik renkli gürültü motoru.
- **Katalog & Sabitler:**
  - 9 Solfeggio frekansı (174 - 963 Hz)
  - Schumann Rezonansı (7.83 Hz) ve 432 Hz Verdi Akordu
  - 5 Beyin Dalgası Bandı (Delta, Theta, Alpha, Beta, Gamma)
- **Apple HIG Deneyimi & PC Emülasyonu:**
  - iPhone 16 Pro Web Simülatör kabuğu (Titanium bezel, Dynamic Island, Safe Area, Status Bar, Home Indicator).
  - OLED True Black (#000000) tasarım, 44pt+ dokunmatik buton boyutları (Gate 4).
  - Canlı akışkan ses dalgası görselleştiricisi (Canvas Wave Visualizer).
- **Test ve Kalite Kapıları:**
  - 4/4 Kalite Kapısı tanımlandı ve Jest test süitinde 10/10 test %100 yeşil doğrulandı.
  - TypeScript tip denetimi (`tsc --noEmit`): 0 hata.
  - Metro Web Bundler export: 198 modül 0 hata.
- **GitHub & Canlı Dağıtım:**
  - GitHub Deposu: https://github.com/omeganredfox/AuraFreq-iOS (Branch: `main`)
  - Canlı Web Simülatörü: https://omeganredfox.github.io/AuraFreq-iOS/ (Branch: `gh-pages`)

---
*Bu doküman Faz 1 sonunda dondurulmuştur ve geriye dönük değiştirilemez.*