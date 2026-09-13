# ğŸ¤– AURAFREQ SUBAGENT PROTOKOLÃœ

Bu belge, Ana OrkestratÃ¶r'Ã¼n (Gemini/Antigravity) bÃ¼yÃ¼k ve karmaÅŸÄ±k gÃ¶revleri daha kÃ¼Ã§Ã¼k, otonom alt ajanlara (Subagents) nasÄ±l daÄŸÄ±tacaÄŸÄ±nÄ± standartlaÅŸtÄ±rÄ±r.

## 1. Alt Ajan (Subagent) Felsefesi
Subagent'lar, Ana OrkestratÃ¶r'Ã¼n "biliÅŸsel yÃ¼kÃ¼nÃ¼" (context window) hafifletmek, araÅŸtÄ±rmalarÄ± paralel yÃ¼rÃ¼tmek veya derinlemesine kod analizi yaptÄ±rmak iÃ§in kullanÄ±lÄ±r. Her Subagent spesifik bir role sahiptir ve sadece o role odaklanÄ±r.

## 2. Ne Zaman Subagent KullanÄ±lmalÄ±?
* **AÄŸÄ±r AraÅŸtÄ±rma:** Ã‡ok sayÄ±da dosyanÄ±n okunmasÄ± veya internetten uzun dokÃ¼manlarÄ±n taranmasÄ± gerektiÄŸinde (`research` subagent).
* **Paralel GÃ¶revler:** OrkestratÃ¶r bir Ã¶zelliÄŸi yazarken, testleri veya UI bileÅŸenini baÅŸka bir ajanÄ±n hazÄ±rlamasÄ± gerektiÄŸinde.
* **Ä°zole Ã‡alÄ±ÅŸma AlanÄ± (Branching):** Yeni ve deneysel bir Ã¶zellik geliÅŸtirilecekse, mevcut kodu bozmamak iÃ§in git mantÄ±ÄŸÄ±na benzer `branch` workspace moduyla subagent Ã§aÄŸrÄ±lÄ±r.

## 3. Standart Subagent Rolleri

### ğŸ” AraÅŸtÄ±rmacÄ± (Researcher)
- **TÃ¼r:** `research` (YerleÅŸik)
- **GÃ¶rev:** Projedeki belirli API'lerin kullanÄ±mÄ±nÄ± araÅŸtÄ±rmak, baÄŸÄ±mlÄ±lÄ±klarÄ± incelemek, log dosyalarÄ±nÄ± taramak veya web'den kÃ¼tÃ¼phane dokÃ¼mantasyonu bulmak.
- **KÄ±sÄ±tlama:** Kod yazamaz, sadece okur ve OrkestratÃ¶r'e raporlar.

### ğŸ§ª Test YazÄ±cÄ± (QA Specialist)
- **TÃ¼r:** `self` (OrkestratÃ¶r yeteneklerini kopyalar)
- **GÃ¶rev:** OrkestratÃ¶r tarafÄ±ndan yazÄ±lmÄ±ÅŸ bir bileÅŸenin Jest/RTL testlerini yazmak. `branch` modunda Ã§alÄ±ÅŸÄ±p testin yeÅŸil olduÄŸunu doÄŸruladÄ±ktan sonra OrkestratÃ¶r'e mesaj atar.

### ğŸ¨ UI/UX TasarÄ±m AsistanÄ±
- **TÃ¼r:** `self` (Ã–zel Prompt ile)
- **GÃ¶rev:** Mevcut tasarÄ±m dilini analiz edip (Ã¶rn: Endel tarzÄ± minimalist OLED UI), belirli bir ekranÄ±n CSS/StyleSheet'ini baÅŸtan yazmak.

## 4. Ä°letiÅŸim ve YaÅŸam DÃ¶ngÃ¼sÃ¼
1. **OluÅŸturma:** OrkestratÃ¶r `invoke_subagent` Ã§aÄŸrÄ±sÄ±yla alt ajanÄ± baÅŸlatÄ±r. Ajana kesin ve net bir Prompt verilir (Ã–rn: "src/screens/MixerScreen.tsx iÃ§indeki performans sorunlarÄ±nÄ± bul ve raporla").
2. **Bekleme Yok:** OrkestratÃ¶r, subagent'Ä±n bitmesini dÃ¶ngÃ¼yle beklemez. Kendi iÅŸine devam eder.
3. **MesajlaÅŸma:** Subagent iÅŸini bitirdiÄŸinde Ana OrkestratÃ¶r'e asenkron olarak mesaj gÃ¶nderir. OrkestratÃ¶r uyanÄ±p sonucu alÄ±r.
4. **Temizlik:** GÃ¶revi biten ve artÄ±k gerekmeyen subagent'lar `manage_subagents` aracÄ±yla (kill) temizlenir.

## 5. Yerel AI (Ollama) ile Entegrasyon (Seviye 2 Ä°ÅŸÃ§iler)
Subagent'lar sadece Gemini tabanlÄ± olmak zorunda deÄŸildir. Ã‡ok basit kod tamamlama, kÃ¼Ã§Ã¼k refactor'lar veya regex yazÄ±mÄ± gibi kÄ±sa gÃ¶revler iÃ§in `~/.gemini/config/skills/local_ai` Ã¼zerinden Ollama modelleri (`devstral-small-2`) REST API ile Ã§aÄŸrÄ±lÄ±p Subagent gibi kullanÄ±labilir.