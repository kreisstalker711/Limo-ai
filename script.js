const promptInput = document.getElementById("prompt-input");
const generateBtn = document.getElementById("generate-btn");
const charNum = document.getElementById("char-num");

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const imageResult = document.getElementById("image-result");

const resultImg = document.getElementById("result-img");
const resultPrompt = document.getElementById("result-prompt");

const retryBtn = document.getElementById("retry-btn");
const downloadBtn = document.getElementById("download-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");
const fullscreenBtn = document.getElementById("fullscreen-btn");

// Character counter
promptInput.addEventListener("input", () => {
  charNum.textContent = promptInput.value.length;
});

// Generate image
generateBtn.addEventListener("click", generateImage);
retryBtn.addEventListener("click", generateImage);

function generateImage() {
  const prompt = promptInput.value.trim();

  if (!prompt) return;

  // Reset states
  errorState.hidden = true;
  imageResult.hidden = true;
  loadingState.hidden = false;

  try {
    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}`;

    // Create image preload
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      resultImg.src = imageUrl;
      resultPrompt.textContent = `"${prompt}"`;

      loadingState.hidden = true;
      imageResult.hidden = false;
    };

    img.onerror = () => {
      throw new Error("Image failed to load");
    };

  } catch (err) {
    loadingState.hidden = true;
    errorState.hidden = false;
  }
}

// Download button
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = resultImg.src;
  link.download = "limo-ai-image.png";
  link.click();
});

// Fullscreen
fullscreenBtn.addEventListener("click", () => {
  lightboxImg.src = resultImg.src;
  lightbox.hidden = false;
});

lightboxClose.addEventListener("click", () => {
  lightbox.hidden = true;
});

lightboxBackdrop.addEventListener("click", () => {
  lightbox.hidden = true;
});