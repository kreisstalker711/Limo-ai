/* ─── Limo AI — api/generate.js ──────────────────────── */
/* Vercel Serverless Function (Node 18+)                 */

export default async function handler(req, res) {

  console.log("KEY EXISTS:", !!process.env.PIXAZO_API_KEY);

  // ── Allow only POST ───────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // ── Parse body safely ───────────────────────────────
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A valid prompt is required." });
    }

    const trimmedPrompt = prompt.trim().slice(0, 500);

    // ── Check API Key ───────────────────────────────────
    const apiKey = process.env.PIXAZO_API_KEY;

    if (!apiKey) {
      console.error("[Limo AI] Missing PIXAZO_API_KEY");
      return res.status(500).json({ error: "Server misconfiguration." });
    }

    // ── Call Pixazo API (UPDATED DOMAIN) ────────────────
    const pixazoResponse = await fetch(
      "https://api.pixazo.ai/v1/images/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          size: "1024x1024"
        }),
      }
    );

    // ── Handle non-JSON responses safely ────────────────
    let pixazoData;
    try {
      pixazoData = await pixazoResponse.json();
    } catch {
      console.error("[Limo AI] Invalid JSON from Pixazo");
      return res.status(502).json({ error: "Invalid response from API." });
    }

    // ── Handle API errors ───────────────────────────────
    if (!pixazoResponse.ok) {
      console.error(
        "[Limo AI] Pixazo error:",
        pixazoResponse.status,
        pixazoData
      );

      return res.status(502).json({
        error: pixazoData?.message || "Image generation failed.",
      });
    }

    // ── Extract Image URL (flexible detection) ──────────
    const imageUrl =
      pixazoData?.url ||
      pixazoData?.imageUrl ||
      pixazoData?.data?.[0]?.url ||
      pixazoData?.image_url ||
      null;

    if (!imageUrl) {
      console.error("[Limo AI] No image URL found:", pixazoData);
      return res.status(502).json({ error: "No image returned." });
    }

    // ── Success ─────────────────────────────────────────
    return res.status(200).json({ imageUrl });

  } catch (err) {
    console.error("[Limo AI] Network error:", err);
    return res.status(503).json({
      error: "Failed to connect to image service.",
    });
  }
}