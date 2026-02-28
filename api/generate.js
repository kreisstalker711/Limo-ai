export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const hfResponse = await fetch(
            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2-1",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: prompt,
                    options: { wait_for_model: true }
                }),
            }
        );

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error("HF RAW ERROR:", errorText);
            return res.status(500).json({ error: errorText });
        }

        const arrayBuffer = await hfResponse.arrayBuffer();

        res.setHeader("Content-Type", "image/png");
        res.status(200).send(Buffer.from(arrayBuffer));

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Image generation failed" });
    }
}