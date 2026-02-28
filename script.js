const generateBtn = document.getElementById("generate-btn");
const promptInput = document.getElementById("prompt-input");
const charNum = document.getElementById("char-num");

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const imageResult = document.getElementById("image-result");
const resultImg = document.getElementById("result-img");
const resultPrompt = document.getElementById("result-prompt");
const errorMessage = document.getElementById("error-message");

// Character counter
promptInput.addEventListener("input", () => {
  charNum.textContent = promptInput.value.length;
});

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) return;

  // Reset states
  errorState.hidden = true;
  imageResult.hidden = true;
  loadingState.hidden = false;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "API error");
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    resultImg.src = imageUrl;
    resultPrompt.textContent = prompt;

    loadingState.hidden = true;
    imageResult.hidden = false;

  } catch (error) {
    loadingState.hidden = true;
    errorState.hidden = false;
    errorMessage.textContent = error.message;
    console.error(error);
  }
});