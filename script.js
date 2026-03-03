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
    // 🔥 Direct Pollinations image URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    // Wait for image to load before showing
    resultImg.onload = () => {
      loadingState.hidden = true;
      imageResult.hidden = false;
    };

    resultImg.onerror = () => {
      throw new Error("Image generation failed");
    };

    resultImg.src = imageUrl;
    resultPrompt.textContent = prompt;

  } catch (error) {
    loadingState.hidden = true;
    errorState.hidden = false;
    errorMessage.textContent = error.message;
    console.error(error);
  }
});