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

  errorState.hidden = true;
  imageResult.hidden = true;
  loadingState.hidden = false;

  const imageUrl =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Date.now()}`;

  resultImg.src = imageUrl;
  resultPrompt.textContent = `"${prompt}"`;

  // If image loads → show result
  resultImg.onload = () => {
    loadingState.hidden = true;
    imageResult.hidden = false;
  };

  // If image fails → show error
  resultImg.onerror = () => {
    loadingState.hidden = true;
    errorState.hidden = false;
  };

  // Safety timeout (in case server never responds)
  setTimeout(() => {
    if (loadingState.hidden === false) {
      loadingState.hidden = true;
      errorState.hidden = false;
    }
  }, 8000);
}