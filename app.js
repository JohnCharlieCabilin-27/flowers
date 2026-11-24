const DEFAULT_DATA = {
  dedication: "For You my Love",
  to: "My Love",
  from: "From: JC",
  note:
    "Every day with you feels like finding a little more sunlight. Thank you for making ordinary moments feel special and for filling my heart with more joy than I knew it could hold.\n\nI hope these flowers remind you how deeply you are loved—today, tomorrow, and always. No matter where life takes us, you will always be my favorite person and my safest place.",
};

// Elements
const dedicationHeading = document.getElementById("dedication-heading");
const envelopeCard = document.getElementById("envelope-card");
const openedKeepsake = document.getElementById("opened-keepsake");
const openLetterBtn = document.getElementById("open-letter-btn");
const closeLetterBtn = document.getElementById("close-letter-btn");
const bouquetReveal = document.getElementById("bouquet-reveal");

const envelopeTo = document.getElementById("envelope-to");
const letterTo = document.getElementById("letter-to");
const letterFrom = document.getElementById("letter-from");
const letterBody = document.getElementById("letter-body");
const letterDate = document.getElementById("letter-date");

const bloomNameEl = document.getElementById("bloom-name");
const bloomTextEl = document.getElementById("bloom-text");
const bloomNodes = document.querySelectorAll(".interactive-bloom");

const showerPetalsBtn = document.getElementById("shower-petals-btn");
const shareKeepsakeBtn = document.getElementById("share-keepsake-btn");

const customizerDialog = document.getElementById("customizer-dialog");
const openCustomizerBtn = document.getElementById("open-customizer");
const closeCustomizerBtn = document.getElementById("close-customizer");
const customizerForm = document.getElementById("customizer-form");
const copyShareLinkBtn = document.getElementById("copy-share-link");
const shareStatus = document.getElementById("share-status");

const inputDedication = document.getElementById("input-dedication");
const inputTo = document.getElementById("input-to");
const inputFrom = document.getElementById("input-from");
const inputNote = document.getElementById("input-note");

let currentState = { ...DEFAULT_DATA };

// Format today's date for the letter stationery
function setTodayDate() {
  const formatted = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  letterDate.textContent = formatted;
}

// Render dedication heading with italic accent on last two words
function renderDedicationTitle(text) {
  const clean = (text || DEFAULT_DATA.dedication).trim();
  const words = clean.split(/\s+/);
  dedicationHeading.replaceChildren();

  if (words.length <= 2) {
    const em = document.createElement("em");
    em.textContent = clean;
    dedicationHeading.appendChild(em);
    return;
  }

  const splitIndex = words.length - 2;
  const plainPart = words.slice(0, splitIndex).join(" ") + " ";
  const italicPart = words.slice(splitIndex).join(" ");

  dedicationHeading.append(document.createTextNode(plainPart));
  const em = document.createElement("em");
  em.textContent = italicPart;
  dedicationHeading.appendChild(em);
}

// Render paragraphs safely
function renderLetterParagraphs(noteText) {
  const paragraphs = (noteText || DEFAULT_DATA.note)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  letterBody.replaceChildren(
    ...paragraphs.map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    })
  );
}

function applyKeepsakeState(state) {
  currentState = { ...DEFAULT_DATA, ...state };

  renderDedicationTitle(currentState.dedication);
  envelopeTo.textContent = currentState.to;
  letterTo.textContent = currentState.to;
  letterFrom.textContent = currentState.from;
  renderLetterParagraphs(currentState.note);

  inputDedication.value = currentState.dedication;
  inputTo.value = currentState.to;
  inputFrom.value = currentState.from;
  inputNote.value = currentState.note;
}

// Load custom state from URL parameters if shared
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const loaded = {
    dedication: params.get("dedication") || DEFAULT_DATA.dedication,
    to: params.get("to") || DEFAULT_DATA.to,
    from: params.get("from") || DEFAULT_DATA.from,
    note: params.get("note") || DEFAULT_DATA.note,
  };
  applyKeepsakeState(loaded);
}

function buildShareURL() {
  const url = new URL(window.location.href);
  url.searchParams.set("dedication", currentState.dedication);
  url.searchParams.set("to", currentState.to);
  url.searchParams.set("from", currentState.from);
  url.searchParams.set("note", currentState.note);
  return url.toString();
}

// Open love letter & reveal the bouquet inside
function openLoveLetter() {
  envelopeCard.hidden = true;
  openedKeepsake.hidden = false;
  openLetterBtn.setAttribute("aria-expanded", "true");
  launchPetalShower(36);
  openedKeepsake.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeLoveLetter() {
  openedKeepsake.hidden = true;
  envelopeCard.hidden = false;
  openLetterBtn.setAttribute("aria-expanded", "false");
  envelopeCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

openLetterBtn.addEventListener("click", openLoveLetter);
closeLetterBtn.addEventListener("click", closeLoveLetter);

// Interactive flower bloom meanings inside the revealed bouquet
bloomNodes.forEach((bloom) => {
  const activateBloom = () => {
    bloomNodes.forEach((node) => node.classList.remove("is-active"));
    bloom.classList.add("is-active");
    bloomNameEl.textContent = bloom.dataset.bloom || "Wildflower";
    bloomTextEl.textContent = bloom.dataset.meaning || "";
  };

  bloom.addEventListener("click", activateBloom);
  bloom.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateBloom();
    }
  });
});

// Customizer modal handlers
openCustomizerBtn.addEventListener("click", () => {
  shareStatus.textContent = "";
  customizerDialog.showModal();
});

closeCustomizerBtn.addEventListener("click", () => customizerDialog.close());

customizerDialog.addEventListener("click", (event) => {
  if (event.target === customizerDialog) {
    customizerDialog.close();
  }
});

customizerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyKeepsakeState({
    dedication: inputDedication.value.trim() || DEFAULT_DATA.dedication,
    to: inputTo.value.trim() || DEFAULT_DATA.to,
    from: inputFrom.value.trim() || DEFAULT_DATA.from,
    note: inputNote.value.trim() || DEFAULT_DATA.note,
  });

  window.history.replaceState({}, "", buildShareURL());
  customizerDialog.close();
  openLoveLetter();
});

async function shareOrCopyLink(statusEl) {
  const shareUrl = buildShareURL();
  window.history.replaceState({}, "", shareUrl);

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${currentState.dedication} — Flowers for you`,
        text: `A love letter and bouquet for ${currentState.to}`,
        url: shareUrl,
      });
      if (statusEl) statusEl.textContent = "Shared!";
      return;
    } catch {
      // User cancelled or share sheet unavailable; fall back to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    if (statusEl) {
      statusEl.textContent = "Link copied! Paste it into any text or chat.";
    } else {
      shareKeepsakeBtn.textContent = "Link copied to clipboard ✓";
      setTimeout(() => {
        shareKeepsakeBtn.innerHTML = 'Send this to your love <span aria-hidden="true">↗</span>';
      }, 2600);
    }
  } catch {
    if (statusEl) statusEl.textContent = "Copy the URL from your browser address bar.";
  }
}

copyShareLinkBtn.addEventListener("click", () => {
  applyKeepsakeState({
    dedication: inputDedication.value.trim() || DEFAULT_DATA.dedication,
    to: inputTo.value.trim() || DEFAULT_DATA.to,
    from: inputFrom.value.trim() || DEFAULT_DATA.from,
    note: inputNote.value.trim() || DEFAULT_DATA.note,
  });
  shareOrCopyLink(shareStatus);
});

shareKeepsakeBtn.addEventListener("click", () => shareOrCopyLink(null));

// Falling Petal Shower Canvas Animation
const canvas = document.getElementById("petal-canvas");
const ctx = canvas.getContext("2d");
const PETAL_COLORS = ["#e98168", "#f1bd56", "#d96f7d", "#ed997a", "#b695c0"];
let petals = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchPetalShower(count = 28) {
  for (let i = 0; i < count; i += 1) {
    petals.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 140,
      size: 6 + Math.random() * 7,
      speedY: 1.4 + Math.random() * 2.2,
      speedX: -0.9 + Math.random() * 1.8,
      rotation: Math.random() * Math.PI * 2,
      spin: -0.04 + Math.random() * 0.08,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    });
  }

  if (!animationId) {
    animatePetals();
  }
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  petals.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.y * 0.02) * 0.6;
    p.rotation += p.spin;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  petals = petals.filter((p) => p.y < canvas.height + 30);

  if (petals.length > 0) {
    animationId = requestAnimationFrame(animatePetals);
  } else {
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

showerPetalsBtn.addEventListener("click", () => launchPetalShower(32));

// Initialize
setTodayDate();
loadFromURL();