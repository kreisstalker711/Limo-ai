async function generateImage() {
    const prompt = document.getElementById("promptInput").value;
    const imageElement = document.getElementById("generatedImage");
    const loadingText = document.getElementById("loadingText");

    if (!prompt) {
        alert("Enter a prompt!");
        return;
    }

    loadingText.innerText = "Generating...";
    imageElement.src = "";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        // 🔥 IMPORTANT CHECK
        if (!response.ok) {
            const errorData = await response.json();
            loadingText.innerText = "Error: " + errorData.error;
            return;
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        imageElement.src = imageUrl;
        loadingText.innerText = "";

    } catch (error) {
        console.error(error);
        loadingText.innerText = "Something went wrong!";
    }
}