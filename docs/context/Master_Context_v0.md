# 📜 MASTER CONTEXT v0 — AURAFREQ iOS PROJE BAŞLANGIÇ SNAPSHOT'I (IMMUTABLE)

> **Tarih:** 2026-09-13T21:46:00+03:00  
> **Durum:** MÜHÜRLÜ / DEĞİŞTİRİLEMEZ (LOCKED)  
> **Faz:** Milestone 0 - Proje Başlangıcı ve Omurga Kurulumu  

---

## 1. 📌 PROJE TANIMI VE STRATEJİK HEDEFLER
- **Uygulama:** AuraFreq iOS (Frekans & Binaural Ses Terapisi)
- **Ana Hedef:** Kullanıcının istediği herhangi bir frekansı (1 Hz - 20.000 Hz) saf ses olarak üretebilen, Sol/Sağ kulak ayrımıyla binaural frekansları (Delta, Theta, Alpha, Beta, Gamma) sentezleyen ve Solfeggio/Schumann/Gürültü presetleri sunan lüks bir Apple iOS uygulaması.
- **Geliştirme Metodolojisi:** LiveLingo'da kanıtlanmış katı mühendislik disiplini, squad iş bölümü (`AGENTS.md`), tek doğruluk kaynağı (`PROJECT_STATE.md`) ve %100 yeşil test kapıları (Zero-Regression).

## 2. 💻 ORTAM VE TEST YAKLAŞIMI
- **İşletim Sistemi:** Windows 11 PC (Ryzen 7 9850X3D, RTX 5080)
- **Teknoloji:** React Native + Expo (TypeScript) + Web Audio API & Native Audio Graph
- **Test Stratejisi:**
  1. Windows PC ekranında anlık etkileşimli iPhone 16 Pro çerçevesi ile Web Fast Refresh testi.
  2. Gerçek iPhone'da Expo Go QR kodu ile kablosuz AirPods/kulaklık stereo testi.
  3. EAS Cloud Build ile Mac gerekmeden `.ipa` ve App Store derlemesi.

## 3. 🛡️ KALİTE VE KABUL KRİTERLERİ (INITIAL CONTRACTS)
- Gate 1: Frekans sapması $\le \pm 0.1\%$
- Gate 2: Binaural Stereo Cross-talk $= 0.0$
- Gate 3: Anti-Pop yumuşak rampa envelope $\ge 10$ ms
- Gate 4: Apple HIG dokunmatik buton alanı $\ge 44 \times 44$ pt

---
*Bu doküman Milestone 0 başlangıcında dondurulmuştur ve geriye dönük değiştirilemez.*