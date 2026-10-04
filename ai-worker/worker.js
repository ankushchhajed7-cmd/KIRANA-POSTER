/*
  Kirana Poster — free AI server (Cloudflare Workers AI)
  Setup: AI-SETUP.md dekho. Is Worker me "Workers AI" binding ka naam AI hona chahiye.

  1) AI background:  GET  /?prompt=...           → image/jpeg   (FLUX.1 schnell)
  2) Photo se naam:  POST /?task=name  {image}   → {"name": "..."}  (vision AI)
*/
// Optional: sirf aapki app se chale (dusre log aapka free quota na khaayein).
// Jaise: 'https://ankushchhajed7-cmd.github.io'   — khaali chhodo to sab jagah se chalega.
const ALLOWED_ORIGIN = '';

const VISION_PROMPT = 'This is a photo of a grocery product package from an Indian kirana shop. ' +
  'Read the brand name and product name printed on the package. Reply with ONLY that name exactly as printed ' +
  '(keep Hindi/Marathi words in Devanagari script), maximum 8 words, no quotes, no explanation.';

const cors = () => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
});
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...cors() } });
const errMsg = e => String(e && e.message || e);

/* AI ke jawab se text nikaalo (alag models alag tarah se dete hain) */
function textOf(out) {
  if (typeof out === 'string') return out;
  const t = out && (out.response ?? out.description ?? out.choices?.[0]?.message?.content ?? out.result?.response);
  return typeof t === 'string' ? t : '';
}
function cleanName(t) {
  return String(t || '').split('\n').map(s => s.trim()).filter(Boolean)[0]?.replace(/^["'*`\s]+|["'*`.\s]+$/g, '').slice(0, 80) || '';
}

/* data:image/jpeg;base64,... → bytes (Workers AI vision models photo ko number-array ke roop me lete hain) */
function bytesOf(dataUrl) {
  const bin = atob(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const out = new Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* Ek-ek karke models try karo — jo aapke free account pe chale, wahi jawab dega */
async function readName(env, dataUrl) {
  const bytes = bytesOf(dataUrl), errs = [];
  const tries = [
    // Meta Llama 3.2 Vision (pehli baar license: /?agree=1) — sawaal "prompt" me, photo bytes me
    ['llama3.2', '@cf/meta/llama-3.2-11b-vision-instruct', { prompt: VISION_PROMPT, image: bytes, max_tokens: 60 }],
    // Meta Llama 4 Scout — photo + text messages me
    ['llama4', '@cf/meta/llama-4-scout-17b-16e-instruct', { messages: [{ role: 'user', content: [
      { type: 'text', text: VISION_PROMPT }, { type: 'image_url', image_url: { url: dataUrl } }] }], max_tokens: 60 }],
    // LLaVA 1.5 — English naam ke liye theek
    ['llava', '@cf/llava-hf/llava-1.5-7b-hf', { prompt: VISION_PROMPT, image: bytes, max_tokens: 60 }]
  ];
  for (const [label, model, input] of tries) {
    try {
      const name = cleanName(textOf(await env.AI.run(model, input)));
      if (name) return name;
      errs.push(label + ': khaali jawab');
    } catch (e) { errs.push(label + ': ' + errMsg(e).slice(0, 120)); }
  }
  throw new Error(errs.join(' | '));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors() });
    if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
      return new Response('Not allowed', { status: 403, headers: cors() });
    }
    const url = new URL(request.url);

    // Photo se product ka naam
    if (request.method === 'POST' && url.searchParams.get('task') === 'name') {
      let body;
      try { body = JSON.parse(await request.text()); } catch (e) { return json({ error: 'galat request' }, 400); }
      const img = body && body.image;
      if (typeof img !== 'string' || !img.startsWith('data:image/') || img.length > 3000000) {
        return json({ error: 'photo nahi mili ya bahut badi hai' }, 400);
      }
      try { return json({ name: await readName(env, img) }); }
      catch (e) { return json({ error: errMsg(e) }, 502); }
    }

    // Llama 3.2 Vision ka license (Meta) — sirf tab kholo jab app ya error me iska zikr ho
    if (url.searchParams.get('agree') === '1') {
      try {
        await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', { prompt: 'agree' });
        return new Response('Meta Llama 3.2 license accept ho gaya ✅', { headers: { 'content-type': 'text/plain; charset=utf-8', ...cors() } });
      } catch (e) {
        // Cloudflare "agree" ka jawab error (5016) ke roop me deta hai: "Thank you for agreeing ..."
        if (/thank you for agreeing/i.test(errMsg(e))) {
          return new Response('Meta Llama 3.2 license accept ho gaya ✅', { headers: { 'content-type': 'text/plain; charset=utf-8', ...cors() } });
        }
        return new Response('Error: ' + errMsg(e), { status: 502, headers: cors() });
      }
    }

    // AI background
    const prompt = (url.searchParams.get('prompt') || '').slice(0, 1500);
    if (!prompt) return new Response('Kirana Poster AI server chal raha hai ✅ (v3: background + photo se naam)', { headers: { 'content-type': 'text/plain; charset=utf-8', ...cors() } });
    try {
      // Note: is model me ab 'seed' allowed nahi — bina seed ke har baar alag image banti hai
      const out = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { prompt });
      const bin = Uint8Array.from(atob(out.image), c => c.charCodeAt(0));
      return new Response(bin, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'no-store', ...cors() } });
    } catch (e) {
      return new Response('AI error: ' + errMsg(e), { status: 502, headers: cors() });
    }
  }
};
