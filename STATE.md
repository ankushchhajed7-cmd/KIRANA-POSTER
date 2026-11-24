# STATE — Kirana Poster Maker (KIRANA-POSTER)

Live: https://ankushchhajed7-cmd.github.io/KIRANA-POSTER/
Repo: ankushchhajed7-cmd/KIRANA-POSTER · single-file PWA (`index.html`) + `sw.js` + `manifest.json` + `img/`

## Abhi ka version

**v1.28** — SW cache `kirana-poster-v30`

## Version history

| Version | Kya aaya |
|---|---|
| v1.28 | Pichhle poster tap → photo ke saath wapas khulta hai (bina confirm), "edit ho raha hai" patti, Download/Share se usi poster me save, har thumbnail pe 📤 seedha share, 12 poster save (pehle 6), poori photo IndexedDB me |
| v1.27 | Sticker save karke ek tap me dobara bhejo |
| v1.23 | जेमिनी तेल → मुरली तेल |
| v1.18 | Har product ki apni photo — AI se ek baar bane, phone me save, apni photo se badlo |
| v1.17 | Product naam ke box me Hindi/Marathi suggestion list |
| v1.16 | Pehli baar setup page + free AI server, roz 10 AI background |
| v1.15 | App look sirf Classic (Gulabi Rose) + Soft 3D |
| v1.14 | Logo ka alag button + logo popup panna |
| v1.13 | App ka look — 6 design |
| v1.12 | Rang (template) ki line upar tabs ke neeche |
| v1.11 | Logo maker — dukaan ke naam se 6 design |
| v1.10 | Bhav List me Ankush Kirana ke 24 naam default |
| v1.9 | Har poster type ka alag page — tabs + side swipe |
| v1.8 | Refresh button + "Update karo" patti |
| v1.7 | Photo daalte hi product ka naam (vision AI) |
| v1.6 | AI Poster — AI background + asli product photo |
| v1.5 | English naam apne aap देवनागरी me |
| v1.4 | Smart background, logo, phone/address/UPI QR patti, saved products, pichhle posters |
| v1.3 | Bulk paste, Festival Greeting, Combo Offer, bhasha, Status 9:16 |
| v1.2 | Bhav List ka text bada + sab fields auto-save |
| v1.1 | Bhav rows localStorage save |

## Poster types (tabs)

`offer` · `single` · `ratelist` (Bhav List) · `combo` · `festival` · `ai`
Size: `post` (1080×1080 / bhav list me auto-lamba) aur `status` (1080×1920)

## Data kahan save hota hai

| Kya | Kahan | Key |
|---|---|---|
| Abhi ka poster state (fields, rows, tpl, layout, lang, size) | localStorage | `kirana_poster_v1` (SKEY) |
| Pichhle 12 poster (thumb + state) | localStorage | `kirana_hist` (HKEY) |
| Pichhle poster ki **poori photo** | IndexedDB `kirana_poster` v2, store `poster` | key = `ts` (string) |
| Har product ki photo | IndexedDB `kirana_poster` v2, store `prodimg` | key = product naam (lowercase) |
| Roz ki bhav list | localStorage | `kirana_bhav_hist` (BKEY) |
| Logo, UI look, AI setting, default naam | localStorage | `kirana_logo`, `kp_ui`, AKEY/ABG, `kp_def_names` |

## Decisions

- **Ek hi file** — `index.html` me sab (HTML + CSS + JS), koi build step nahi.
- **Service worker network-first** — har build pe `CACHE` version bump karna zaroori, warna purana app chalta rahega.
- Poster images localStorage me nahi jaate (5 MB limit) — IndexedDB me jaate hain.
- Product photo poster ke saath save nahi hoti; product ke naam se `prodimg` store se wapas lagti hai (isliye poster khulte hi photo aa jati hai).
- Edit mode: history se poster kholne pe `editTs` set hota hai; Download/Share usi entry ko update karta hai. Poster type (tab) badalne pe ya "➕ Naya poster" dabane pe `editTs` clear.

## Pending / aage ke ideas

- [ ] Saved posters me 🔍 dhundo (product naam se)
- [ ] Purane poster X din baad apne aap hatana (abhi sirf 12 ki limit)
- [ ] Rate badla to poster pe ↑↓ arrow (kal ke rate se compare)
- [ ] Multiple numbers pe ek saath bhejna — WhatsApp Broadcast/Channel ke bina seedha nahi hota (alag app ka plan)

> Note: file ke upar wala changelog comment v1.18 ke baad update hona ruk gaya tha, jabki app header v1.27 tak pahunch gaya tha. v1.28 se dono ek saath badalne hain — header `<b>vX.Y</b>` (line ~316) aur upar ka comment block.
