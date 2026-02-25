export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {

    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Valid prompt required" });
    }

    const trimmedPrompt = prompt.trim().slice(0, 500);

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Server configuration error" });
    }

const response = await fetch(
  "https://router.huggingface.co/hf-inference/models/runwayml/stable-diffusion-v1-5",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: trimmedPrompt
    })
  }
);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({
        error: errText || "AI generation failed"
      });
    }

    const buffer = await response.arrayBuffer();

    const base64 = Buffer.from(buffer).toString("base64");

    const imageUrl = `data:image/png;base64,${base64}`;

    return res.status(200).json({
      imageUrl
    });

  } catch (err) {

    console.error("[Limo AI]", err);

    return res.status(503).json({
      error: "Failed to generate image"
    });
  }
}