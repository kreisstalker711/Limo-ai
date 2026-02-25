/* ─── Limo AI — script.js ────────────────────────────── */

// ── Element refs ──────────────────────────────────────
const promptInput   = document.getElementById('prompt-input');
const charNum       = document.getElementById('char-num');
const generateBtn   = document.getElementById('generate-btn');
const loadingState  = document.getElementById('loading-state');
const errorState    = document.getElementById('error-state');
const errorMessage  = document.getElementById('error-message');
const retryBtn      = document.getElementById('retry-btn');
const imageResult   = document.getElementById('image-result');
const resultImg     = document.getElementById('result-img');
const resultPrompt  = document.getElementById('result-prompt');
const downloadBtn   = document.getElementById('download-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBack  = document.getElementById('lightbox-backdrop');

// ── State ─────────────────────────────────────────────
let currentImageUrl = '';
let lastPrompt      = '';
let isLoading       = false;

// ── Character counter ─────────────────────────────────
promptInput.addEventListener('input', () => {
  const len = promptInput.value.length;
  charNum.textContent = len;
  charNum.style.color = len > 450
    ? 'rgba(224,92,92,0.8)'
    : 'rgba(232,230,224,0.22)';
});

// ── UI State Helpers ──────────────────────────────────
function showOnly(el) {
  [loadingState, errorState, imageResult].forEach(e => {
    e.hidden = (e !== el);
  });
}

function hideAll() {
  loadingState.hidden = true;
  errorState.hidden   = true;
  imageResult.hidden  = true;
}

function setLoading(on) {
  isLoading = on;
  generateBtn.disabled = on;
  generateBtn.querySelector('.btn-text').textContent = on
    ? 'Generating…'
    : 'Generate Image';
}

function showError(msg) {
  errorMessage.textContent = msg || 'Something went wrong. Please try again.';
  showOnly(errorState);
}

// ── Core: Generate Image ──────────────────────────────
async function generateImage() {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    promptInput.focus();
    promptInput.style.borderColor = 'rgba(224,92,92,0.5)';
    setTimeout(() => promptInput.style.borderColor = '', 1200);
    return;
  }

  lastPrompt = prompt;
  setLoading(true);
  showOnly(loadingState);

  try {
    const response = await fetch('/api/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error (${response.status})`);
    }

    if (!data.imageUrl) {
      throw new Error('No image URL returned from server.');
    }

    // Display result
    currentImageUrl = data.imageUrl;
    resultImg.src   = data.imageUrl;
    lightboxImg.src = data.imageUrl;
    resultPrompt.textContent = `"${prompt}"`;

    // Wait for image to load before revealing
    resultImg.onload = () => showOnly(imageResult);
    resultImg.onerror = () => showError('Image loaded but could not be displayed.');

  } catch (err) {
    console.error('[Limo AI] Error:', err);
    const friendly = err.message.includes('Failed to fetch')
      ? 'Could not reach the server. Make sure it is running.'
      : err.message;
    showError(friendly);
  } finally {
    setLoading(false);
  }
}

// ── Events ────────────────────────────────────────────
generateBtn.addEventListener('click', generateImage);

// Generate on Ctrl+Enter / Cmd+Enter
promptInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    generateImage();
  }
});

// Retry
retryBtn.addEventListener('click', () => {
  if (lastPrompt) {
    promptInput.value = lastPrompt;
    charNum.textContent = lastPrompt.length;
  }
  hideAll();
  generateImage();
});

// Download
downloadBtn.addEventListener('click', async () => {
  if (!currentImageUrl) return;
  try {
    const res   = await fetch(currentImageUrl);
    const blob  = await res.blob();
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href      = url;
    a.download  = `limo-ai-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: open in new tab
    window.open(currentImageUrl, '_blank');
  }
});

// Fullscreen lightbox
fullscreenBtn.addEventListener('click', () => {
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
});

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBack.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

// ── Boot animation ────────────────────────────────────
promptInput.addEventListener('focus', () => {
  document.querySelector('.generator-card').style.transform = 'translateY(-1px)';
}, { passive: true });
promptInput.addEventListener('blur', () => {
  document.querySelector('.generator-card').style.transform = '';
}, { passive: true });