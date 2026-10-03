# ✨ AI Poster — free AI server setup (5 minute)

AI Poster ka background AI se banta hai. Iske liye aapka **apna free Cloudflare server** sabse bharosemand hai.
Cloudflare har account ko roz free AI quota deta hai (roz raat 12 baje UTC pe reset). Card ya payment nahi chahiye.

## Step 1 — Cloudflare account
1. <https://dash.cloudflare.com/sign-up> pe email se free account banao.

## Step 2 — Worker banao
1. Dashboard me **Workers & Pages** kholo (left menu me "Compute" ke andar ho sakta hai).
2. **Create** → **Worker** → "Hello World" wala chuno.
3. Naam do, jaise `kirana-ai` → **Deploy**.
4. Ab **Edit code** dabao. Jo code dikh raha hai sab hata do, aur is repo ki
   [`ai-worker/worker.js`](ai-worker/worker.js) ka poora code paste karo → **Deploy**.

## Step 3 — AI jodo (binding)
1. Worker ke **Settings** → **Bindings** → **Add** → **Workers AI**.
2. Variable name me likho: `AI` (bade akshar me) → **Save / Deploy**.

## Step 4 — App me URL daalo
1. Worker ka URL copy karo, jaise `https://kirana-ai.aapka-naam.workers.dev`.
   Browser me khologe to likha aayega: *"Kirana Poster AI server chal raha hai ✅"*.
2. Poster app me **✨ AI Poster** → **⚙️ AI setting** → **Cloudflare server URL** me paste karo.
3. **✨ AI background banao** dabao — 10–30 second me naya background!

## (Optional) Sirf apni app ke liye lock karo
Koi aur aapka URL use karke free quota na khaa jaye, isliye `worker.js` me upar
`ALLOWED_ORIGIN` me apni app ka address likh do, jaise `'https://ankushchhajed7-cmd.github.io'`, aur dobara Deploy karo.

## Kuch nahi chal raha?
- URL `https://` se shuru hona chahiye, end me `/` ki zarurat nahi.
- Binding ka naam bilkul `AI` hona chahiye.
- Roz ka free quota khatam ho gaya ho to agle din phir chalega — tab tak app design wala background lagata hai.
