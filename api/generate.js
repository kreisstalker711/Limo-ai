/* ─── Limo AI — api/generate.js ──────────────────────── */
/* Vercel Serverless Function                             */

console.log("PIXAZO KEY:", process.env.PIXAZO_API_KEY);
export default async function handler(req, res) {

  // ── Only allow POST ──────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ── Parse prompt ─────────────────────────────────────
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'A non-empty prompt is required.' });
  }

  const trimmedPrompt = prompt.trim().slice(0, 500); // enforce max length

  // ── Read API key from environment ────────────────────
  const apiKey = process.env.PIXAZO_API_KEY;

  if (!apiKey) {
    console.error('[Limo AI] PIXAZO_API_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error. API key missing.' });
  }

  // ── Call Pixazo API ───────────────────────────────────
  try {
    const pixazoResponse = await fetch('https://api.pixazo.io/v1/images/generate', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: trimmedPrompt,
        // Add any other Pixazo-supported params here, e.g.:
        // size: '1024x1024',
        // style: 'realistic',
        // n: 1,
      }),
    });

    const pixazoData = await pixazoResponse.json();

    // ── Handle Pixazo errors ─────────────────────────────
    if (!pixazoResponse.ok) {
      const msg = pixazoData?.message || pixazoData?.error || 'Pixazo API error.';
      console.error('[Limo AI] Pixazo API error:', pixazoResponse.status, msg);
      return res.status(502).json({ error: `Image generation failed: ${msg}` });
    }

    // ── Extract image URL ─────────────────────────────────
    // Adapt this path to match Pixazo's actual response shape.
    // Common patterns: data.url / data.data[0].url / data.imageUrl
    const imageUrl =
      pixazoData?.url             ||
      pixazoData?.imageUrl        ||
      pixazoData?.data?.[0]?.url  ||
      pixazoData?.image_url       ||
      null;

    if (!imageUrl) {
      console.error('[Limo AI] Could not find image URL in Pixazo response:', pixazoData);
      return res.status(502).json({ error: 'No image URL in API response.' });
    }

    // ── Return success ────────────────────────────────────
    return res.status(200).json({ imageUrl });

  } catch (err) {
    console.error('[Limo AI] Network/fetch error calling Pixazo:', err);
    return res.status(503).json({ error: 'Failed to reach Pixazo API. Please try again.' });
  }
}