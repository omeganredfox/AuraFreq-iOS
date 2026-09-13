# AuraFreq iOS

> Pure Tone & Binaural Sound Therapy App for Apple Ecosystem.

AuraFreq, modern ve bilimsel bir frekans terapi uygulamasıdır. Endel ve Spotify benzeri premium, karanlık (OLED Black) bir kullanıcı arayüzü sunarken, arka planda gelişmiş bir "Multi-Layer DSP Engine" çalıştırır.

## Özellikler

*   **Saf Ton Üreticisi (Tone Lab):** Hassas Solfeggio frekansları (432 Hz, 528 Hz vb.) ve sinüs, üçgen, testere dişi dalga formları üretimi.
*   **Beyin Dalgası Uyarımı (Binaural Lab):** Sağ ve sol kulağa farklı frekanslar göndererek beyin dalgalarını (Delta, Theta, Alpha, Beta, Gamma) senkronize eden (entrainment) gelişmiş motor.
*   **Çoklu Katman Mikseri:** Saf ton, isochronic/binaural darbeler ve doğa seslerini (Beyaz/Pembe/Kahve Gürültü, Yağmur, Okyanus) aynı anda harmanlama imkanı.
*   **Premium Şifa (Presets) Ekranı:** "Sleep & Rest", "Deep Focus", "Meditation" kategorilerine ayrılmış hazır şifa reçeteleri ve özel favori kaydetme (AsyncStorage) sistemi.
*   **Uyku Zamanlayıcısı:** 15, 30 ve 60 dakikalık geri sayım ile ses motorunu otomatik ve yumuşak şekilde durdurma (Fade-out).
*   **Görselleştiriciler:** Canlı Lissajous eğrileri ve interaktif Haptic Rotary Dial.
*   **Yüzen Mini Oynatıcı:** Ekranın en altında sabit duran, çalma durumunu ve aktif frekansı gösteren modern "Bottom Player".

## Teknik Mimari (v0.5.0)

*   **Platform:** React Native (Expo) - `app.json` üzerinden tamamen karanlık tema ve native konfigürasyonlar.
*   **Audio Engine:** Platform bağımsız (iOS Safari uyumlu) Custom Web Audio API tabanlı `dspEngine`.
*   **UI/UX:** Vektör ikonlar (`@expo/vector-icons`), Apple HIG prensipleri, True Black (#000000) kontrastı.
*   **Test & Kalite:** 13/13 Jest & React Native Testing Library testiyle %100 kapsama oranı.
*   **Yapay Zeka (AI) Odaklılık:** Tüm proje `AGENTS.md` ve `SUBAGENTS_PROTOCOL.md` belgeleriyle kodlanmış otonom AI (Gemini + Local Ollama) sistemleriyle geliştirilmiştir.