/*
  Kirana Poster — free AI background server (Cloudflare Workers AI, FLUX.1 schnell)
  Setup: AI-SETUP.md dekho. Is Worker me "Workers AI" binding ka naam AI hona chahiye.

  Request:  GET https://<aapka-worker>.workers.dev/?prompt=...&seed=123
  Response: image/jpeg
*/
// Optional: sirf aapki app se chale (dusre log aapka free quota na khaayein).
// Jaise: 'https://ankushchhajed7-cmd.github.io'   — khaali chhodo to sab jagah se chalega.
const ALLOWED_ORIGIN = '';

const cors = origin => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Vary': 'Origin'
});

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (ALLOWED_ORIGIN && origin && origin !== ALLOWED_ORIGIN) {
      return new Response('Not allowed', { status: 403, headers: cors(origin) });
    }
    const url = new URL(request.url);
    const prompt = (url.searchParams.get('prompt') || '').slice(0, 1500);
    if (!prompt) return new Response('Kirana Poster AI server chal raha hai ✅', { headers: { 'content-type': 'text/plain; charset=utf-8', ...cors(origin) } });
    const seed = parseInt(url.searchParams.get('seed'), 10) || Math.floor(Math.random() * 1e9);
    try {
      const out = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { prompt, seed, steps: 6 });
      const bin = Uint8Array.from(atob(out.image), c => c.charCodeAt(0));
      return new Response(bin, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'no-store', ...cors(origin) } });
    } catch (e) {
      return new Response('AI error: ' + (e && e.message || e), { status: 502, headers: cors(origin) });
    }
  }
};
