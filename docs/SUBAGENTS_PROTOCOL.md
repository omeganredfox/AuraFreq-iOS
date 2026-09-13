# ÄŸÅ¸Â¤â€“ AURAFREQ SUBAGENT PROTOKOLÃƒÅ“

Bu belge, Ana OrkestratÃƒÂ¶r'ÃƒÂ¼n (Gemini/Antigravity) bÃƒÂ¼yÃƒÂ¼k ve karmaÃ…Å¸Ã„Â±k gÃƒÂ¶revleri daha kÃƒÂ¼ÃƒÂ§ÃƒÂ¼k, otonom alt ajanlara (Subagents) nasÃ„Â±l daÃ„Å¸Ã„Â±tacaÃ„Å¸Ã„Â±nÃ„Â± standartlaÃ…Å¸tÃ„Â±rÃ„Â±r.

## 1. Alt Ajan (Subagent) Felsefesi
Subagent'lar, Ana OrkestratÃƒÂ¶r'ÃƒÂ¼n "biliÃ…Å¸sel yÃƒÂ¼kÃƒÂ¼nÃƒÂ¼" (context window) hafifletmek, araÃ…Å¸tÃ„Â±rmalarÃ„Â± paralel yÃƒÂ¼rÃƒÂ¼tmek veya derinlemesine kod analizi yaptÃ„Â±rmak iÃƒÂ§in kullanÃ„Â±lÃ„Â±r. Her Subagent spesifik bir role sahiptir ve sadece o role odaklanÃ„Â±r.

## 2. Ne Zaman Subagent KullanÃ„Â±lmalÃ„Â±?
* **AÃ„Å¸Ã„Â±r AraÃ…Å¸tÃ„Â±rma:** Ãƒâ€¡ok sayÃ„Â±da dosyanÃ„Â±n okunmasÃ„Â± veya internetten uzun dokÃƒÂ¼manlarÃ„Â±n taranmasÃ„Â± gerektiÃ„Å¸inde (`research` subagent).
* **Paralel GÃƒÂ¶revler:** OrkestratÃƒÂ¶r bir ÃƒÂ¶zelliÃ„Å¸i yazarken, testleri veya UI bileÃ…Å¸enini baÃ…Å¸ka bir ajanÃ„Â±n hazÃ„Â±rlamasÃ„Â± gerektiÃ„Å¸inde.
* **Ã„Â°zole Ãƒâ€¡alÃ„Â±Ã…Å¸ma AlanÃ„Â± (Branching):** Yeni ve deneysel bir ÃƒÂ¶zellik geliÃ…Å¸tirilecekse, mevcut kodu bozmamak iÃƒÂ§in git mantÃ„Â±Ã„Å¸Ã„Â±na benzer `branch` workspace moduyla subagent ÃƒÂ§aÃ„Å¸rÃ„Â±lÃ„Â±r.

## 3. Standart Subagent Rolleri

### ÄŸÅ¸â€Â AraÃ…Å¸tÃ„Â±rmacÃ„Â± (Researcher)
- **TÃƒÂ¼r:** `research` (YerleÃ…Å¸ik)
- **GÃƒÂ¶rev:** Projedeki belirli API'lerin kullanÃ„Â±mÃ„Â±nÃ„Â± araÃ…Å¸tÃ„Â±rmak, baÃ„Å¸Ã„Â±mlÃ„Â±lÃ„Â±klarÃ„Â± incelemek, log dosyalarÃ„Â±nÃ„Â± taramak veya web'den kÃƒÂ¼tÃƒÂ¼phane dokÃƒÂ¼mantasyonu bulmak.
- **KÃ„Â±sÃ„Â±tlama:** Kod yazamaz, sadece okur ve OrkestratÃƒÂ¶r'e raporlar.

### ÄŸÅ¸Â§Âª Test YazÃ„Â±cÃ„Â± (QA Specialist)
- **TÃƒÂ¼r:** `self` (OrkestratÃƒÂ¶r yeteneklerini kopyalar)
- **GÃƒÂ¶rev:** OrkestratÃƒÂ¶r tarafÃ„Â±ndan yazÃ„Â±lmÃ„Â±Ã…Å¸ bir bileÃ…Å¸enin Jest/RTL testlerini yazmak. `branch` modunda ÃƒÂ§alÃ„Â±Ã…Å¸Ã„Â±p testin yeÃ…Å¸il olduÃ„Å¸unu doÃ„Å¸ruladÃ„Â±ktan sonra OrkestratÃƒÂ¶r'e mesaj atar.

### ÄŸÅ¸ÂÂ¨ UI/UX TasarÃ„Â±m AsistanÃ„Â±
- **TÃƒÂ¼r:** `self` (Ãƒâ€“zel Prompt ile)
- **GÃƒÂ¶rev:** Mevcut tasarÃ„Â±m dilini analiz edip (ÃƒÂ¶rn: Endel tarzÃ„Â± minimalist OLED UI), belirli bir ekranÃ„Â±n CSS/StyleSheet'ini baÃ…Å¸tan yazmak.

## 4. Ã„Â°letiÃ…Å¸im ve YaÃ…Å¸am DÃƒÂ¶ngÃƒÂ¼sÃƒÂ¼
1. **OluÃ…Å¸turma:** OrkestratÃƒÂ¶r `invoke_subagent` ÃƒÂ§aÃ„Å¸rÃ„Â±sÃ„Â±yla alt ajanÃ„Â± baÃ…Å¸latÃ„Â±r. Ajana kesin ve net bir Prompt verilir (Ãƒâ€“rn: "src/screens/MixerScreen.tsx iÃƒÂ§indeki performans sorunlarÃ„Â±nÃ„Â± bul ve raporla").
2. **Bekleme Yok:** OrkestratÃƒÂ¶r, subagent'Ã„Â±n bitmesini dÃƒÂ¶ngÃƒÂ¼yle beklemez. Kendi iÃ…Å¸ine devam eder.
3. **MesajlaÃ…Å¸ma:** Subagent iÃ…Å¸ini bitirdiÃ„Å¸inde Ana OrkestratÃƒÂ¶r'e asenkron olarak mesaj gÃƒÂ¶nderir. OrkestratÃƒÂ¶r uyanÃ„Â±p sonucu alÃ„Â±r.
4. **Temizlik:** GÃƒÂ¶revi biten ve artÃ„Â±k gerekmeyen subagent'lar `manage_subagents` aracÃ„Â±yla (kill) temizlenir.

## 5. Yerel AI (Ollama) ile Entegrasyon (Seviye 2 Ã„Â°Ã…Å¸ÃƒÂ§iler)
Subagent'lar sadece Gemini tabanlÃ„Â± olmak zorunda deÃ„Å¸ildir. Ãƒâ€¡ok basit kod tamamlama, kÃƒÂ¼ÃƒÂ§ÃƒÂ¼k refactor'lar veya regex yazÃ„Â±mÃ„Â± gibi kÃ„Â±sa gÃƒÂ¶revler iÃƒÂ§in `~/.gemini/config/skills/local_ai` ÃƒÂ¼zerinden Ollama modelleri (`devstral-small-2`) REST API ile ÃƒÂ§aÃ„Å¸rÃ„Â±lÃ„Â±p Subagent gibi kullanÃ„Â±labilir.