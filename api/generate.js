export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt
                })
            }
        );

        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", "image/png");
        res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Image generation failed" });
    }
}