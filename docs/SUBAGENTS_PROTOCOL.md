# 🤖 AURAFREQ SUBAGENT PROTOKOLÜ

Bu belge, Ana Orkestratör'ün (Gemini/Antigravity) büyük ve karmaşık görevleri daha küçük, otonom alt ajanlara (Subagents) nasıl dağıtacağını standartlaştırır.

## 1. Alt Ajan (Subagent) Felsefesi
Subagent'lar, Ana Orkestratör'ün "bilişsel yükünü" (context window) hafifletmek, araştırmaları paralel yürütmek veya derinlemesine kod analizi yaptırmak için kullanılır. Her Subagent spesifik bir role sahiptir ve sadece o role odaklanır.

## 2. Ne Zaman Subagent Kullanılmalı?
* **Ağır Araştırma:** Çok sayıda dosyanın okunması veya internetten uzun dokümanların taranması gerektiğinde (`research` subagent).
* **Paralel Görevler:** Orkestratör bir özelliği yazarken, testleri veya UI bileşenini başka bir ajanın hazırlaması gerektiğinde.
* **İzole Çalışma Alanı (Branching):** Yeni ve deneysel bir özellik geliştirilecekse, mevcut kodu bozmamak için git mantığına benzer `branch` workspace moduyla subagent çağrılır.

## 3. Standart Subagent Rolleri

### 🔍 Araştırmacı (Researcher)
- **Tür:** `research` (Yerleşik)
- **Görev:** Projedeki belirli API'lerin kullanımını araştırmak, bağımlılıkları incelemek, log dosyalarını taramak veya web'den kütüphane dokümantasyonu bulmak.
- **Kısıtlama:** Kod yazamaz, sadece okur ve Orkestratör'e raporlar.

### 🧪 Test Yazıcı (QA Specialist)
- **Tür:** `self` (Orkestratör yeteneklerini kopyalar)
- **Görev:** Orkestratör tarafından yazılmış bir bileşenin Jest/RTL testlerini yazmak. `branch` modunda çalışıp testin yeşil olduğunu doğruladıktan sonra Orkestratör'e mesaj atar.

### 🎨 UI/UX Tasarım Asistanı
- **Tür:** `self` (Özel Prompt ile)
- **Görev:** Mevcut tasarım dilini analiz edip (örn: Endel tarzı minimalist OLED UI), belirli bir ekranın CSS/StyleSheet'ini baştan yazmak.

## 4. İletişim ve Yaşam Döngüsü
1. **Oluşturma:** Orkestratör `invoke_subagent` çağrısıyla alt ajanı başlatır. Ajana kesin ve net bir Prompt verilir (Örn: "src/screens/MixerScreen.tsx içindeki performans sorunlarını bul ve raporla").
2. **Bekleme Yok:** Orkestratör, subagent'ın bitmesini döngüyle beklemez. Kendi işine devam eder.
3. **Mesajlaşma:** Subagent işini bitirdiğinde Ana Orkestratör'e asenkron olarak mesaj gönderir. Orkestratör uyanıp sonucu alır.
4. **Temizlik:** Görevi biten ve artık gerekmeyen subagent'lar `manage_subagents` aracıyla (kill) temizlenir.

## 5. Yerel AI (Ollama) ile Entegrasyon (Seviye 2 İşçiler)
Subagent'lar sadece Gemini tabanlı olmak zorunda değildir. Çok basit kod tamamlama, küçük refactor'lar veya regex yazımı gibi kısa görevler için `~/.gemini/config/skills/local_ai` üzerinden Ollama modelleri (`devstral-small-2`) REST API ile çağrılıp Subagent gibi kullanılabilir.