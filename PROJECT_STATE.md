# 📊 AURAFREQ iOS — SINGLE SOURCE OF TRUTH (PROJECT_STATE.md)

> **Son Güncelleme:** 2026-09-14T00:08:00+03:00  
> **Proje Versiyonu:** v0.4.0 (Faz 4 Tamamlandı)  
> **Geliştirme Ortamı:** Windows 11 PC (Ryzen 7 9850X3D, RTX 5080)  
> **Hedef Platform:** Apple iOS (iPhone) / Web Audio Simulation  
> **Teknoloji Yığını:** React Native + Expo (TypeScript) + AsyncStorage + Web Audio API  
> **Global Yerel-AI Desteği:** Aktif (`devstral-small-2`)  

---

## 🎯 GÜNCEL DURUM ÖZETİ
* **Aktif Faz:** `Faz 4: Uyku Zamanlayıcı & Favori Reçeteler (TAMAMLANDI)`
* **Sıradaki Faz:** `Faz 5: Apple Store Hazırlığı (Native Build, App Icon, Launch Screen, EAS)`
* **Genel İlerleme:** %95
* **Test Durumu:** 13/13 Test %100 YEŞİL (PASS)
* **Derleme Durumu:** `tsc --noEmit` 0 Hata
* **Blokajlar:** Yok.

---

## 🚦 FAZ VE MİLESTONE DURUMLARI

| Milestone | Kapsam / Hedef | Durum | Kalite Kapısı |
| :--- | :--- | :--- | :--- |
| **Faz 1 (M1)** | Hafıza omurgası, Simülatör | 🟢 COMPLETED | PASS |
| **Faz 2 (M2)** | Çoklu Katman Mikseri, İzokronik Tonlar | 🟢 COMPLETED | 13/13 Test PASS |
| **Faz 3 (M3)** | Lissajous Görselleştirici, Rotary Dial | 🟢 COMPLETED | PASS |
| **Faz 4 (M4)** | Uyku Zamanlayıcı, Favori Reçeteler (AsyncStorage) | 🟢 COMPLETED | 13/13 Test PASS (Master_Context_v3 mühürlendi) |
| **Faz 5 (M5)** | Apple Store / Expo EAS Native Build & İkonlar | ⚪ READY TO START | CI/CD |

---

## 📦 DOSYA ENVANTERİ (v0.4.0)
| Dosya | Açıklama |
| :--- | :--- |
| `AGENTS.md` | Squad Rolleri & **Global Local-AI Desteği** kuralları |
| `PROJECT_STATE.md` | Tek doğruluk kaynağı |
| `src/hooks/useSleepTimer.ts` | **[YENİ]** Uyku zamanlayıcısı geri sayım hook'u |
| `src/store/storage.ts` | **[YENİ]** AsyncStorage Favori veri katmanı |
| `src/screens/MixerScreen.tsx` | Çoklu katman mikseri + Favori Kaydet butonu eklendi |
| `src/screens/PresetsScreen.tsx` | Hazır şifa presetleri + Uyku Zamanlayıcısı + Kullanıcı Favorileri |