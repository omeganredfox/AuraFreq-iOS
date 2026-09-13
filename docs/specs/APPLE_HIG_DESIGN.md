# 🎨 AURAFREQ — APPLE HUMAN INTERFACE GUIDELINES (HIG) SPECIFICATION

> **Standart:** Apple iOS 18 Design Language & Human Interface Guidelines  
> **Tema:** Audiophile Luxury Dark Mode (OLED True Black `#000000`)  
> **Donanım Çerçevesi:** iPhone 16 Pro (393 × 852 pt, Dynamic Island, Safe Area Insets)  

---

## 1. 🌈 RENK PALETİ VE MATERYALLER (MATERIALS & VIBRANCY)

### 1.1. Renkler
- **Canvas / Arka Plan:** `#000000` (Mutlak OLED Siyahı — pil tasarrufu ve derin kontrast).
- **Yüzey / Kartlar (Cards):** `#121214` (Hafif lüks koyu gri, `border: 1px solid rgba(255,255,255,0.08)`).
- **İkincil Yüzey:** `#1C1C1E` (Apple System Gray 6 Dark).
- **Aksan Renkleri (Frekans & Mod Temaları):**
  - *Delta / Uyku:* `#5E5CE6` (Deep Indigo)
  - *Theta / Meditasyon:* `#BF5AF2` (Electric Purple)
  - *Alpha / Sakin Odak:* `#0A84FF` (Cupertino Blue)
  - *Beta / Yüksek Konsantrasyon:* `#30D158` (Vibrant Emerald)
  - *Gamma / Zirve Zihin:* `#FF9F0A` (Luminous Amber)
  - *Solfeggio Şifa:* `#64D2FF` (Celestial Cyan)

---

## 2. 🔤 TİPOGRAFİ VE SAYISAL HASSASİYET

- Apple San Francisco (SF Pro / System Font) hiyerarşisi:
  - **Büyük Başlık (Large Title):** 34pt Bold (Uygulama veya Mod başlığı).
  - **Frekans Göstergesi (Hero Number):** 54pt Semi-Bold Monospace Tabular Figures (sayılar değişirken jitter yapmaz).
  - **Birim (Unit):** 18pt Medium Muted (`Hz`).
  - **Gövde Metni (Body):** 15pt Regular (`#8E8E93` ikincil açıklama).
  - **Rozet / Etiket (Badge):** 11pt Heavy Uppercase (`BINAURAL`, `STEREO HEADPHONES REQUIRED`).

---

## 3. 👆 DOKUNMATİK ERİŞİLEBİLİRLİK (GATE 4)

- Apple HIG standardı gereği, dokunulabilir her bir buton, sekme ve kadran **en az $44 \times 44$ pt** aktif dokunma alanına (hit target) sahip olmalıdır.
- Haptik hissi: Web ortamında yumuşak CSS scale animasyonu ($0.96 \times$ basma efekti), iOS ortamında `expo-haptics` ile Light/Medium darbe titreşimi.

---

## 4. 📱 PC'DE IPHONE 16 PRO WEB SİMÜLATÖR KABUĞU

Windows PC ekranında geliştirme yaparken tarayıcıda doğrudan tam piksel bir iPhone gövdesi sunulur:
- **Gövde Ölçüleri:** $393\text{px} \times 852\text{px}$ (CSS viewport sınırlandırması).
- **Köşe Yuvarlaklığı:** `border-radius: 54px` (Gerçek iPhone 16 Pro eğrisi).
- **Dynamic Island:** $126\text{px} \times 37\text{px}$ oval hap, üstten 11px mesafede.
- **Titanium Bezel:** 12px koyu metalik fırçalanmış dış çerçeve (`#222224` + subtle specular highlight).
- **Safe Area Insetleri:**
  - `padding-top: 54px`
  - `padding-bottom: 34px` (Home Indicator Bar ile).