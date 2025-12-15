// Sequence puzzle
const correctSequence = ["cupcake", "pizza", "partyhat", "paperplate"];
let playerSequence = [];
let tableItems = [null, null, null, null, null];

function placeItem(itemId) {
  const tableRow = document.getElementById("tableRow");

  for (let i = 0; i < tableItems.length; i++) {
    if (!tableItems[i]) {
      tableItems[i] = itemId;

      const img = document.createElement("img");
      img.src = `images/${itemId}.png`;
      img.classList.add("contain-image");
      tableRow.children[i].appendChild(img);
      break;
    }
  }

  playerSequence.push(itemId);

  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== correctSequence[i]) {
      playerSequence = [];
      return;
    }
  }

  if (playerSequence.length === correctSequence.length) {
    moveKeyToNotepad();
    playerSequence = [];
  }
}

// Move key to where notepad originally was
function moveKeyToNotepad() {
  const notepad = document.getElementById("notepad");
  const tableRow = document.getElementById("tableRow");

  if (notepad) {
    const img = document.createElement("img");
    img.src = "images/key1.png";
    img.classList.add("contain-image");
    const parentBox = notepad.parentElement;
    parentBox.innerHTML = "";
    parentBox.appendChild(img);
    notepad.remove();
  }
}

// Open notepad modal
function openNotepad() {
  const modal = document.getElementById("posterModal");
  modal.style.display = "flex";
}

function hidePosterModal() {
  const modal = document.getElementById("posterModal");
  modal.style.display = "none";
}

//------------------------------------------------------------//

let puzzleSolved = false;
let modalPlayerSequence = [];
const modalCorrectSequence = [
  "cupcake",
  "partyhat",
  "cupcake",
  "pizza",
  "pizza",
  "pizza",
  "partyhat",
  "cupcake",
  "partyhat",
];

// Timer variables
let notepadTimer;
const timerDuration = 20; // 30 seconds

// OPEN MODAL FUNCTION WITH TIMER
function openNotepad2() {
  const modal = document.getElementById("myModal");
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "flex-start";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.paddingTop = "20px";
  wrapper.style.boxSizing = "border-box";

  // --- TIMER DISPLAY ---
  const timerDisplay = document.createElement("div");
  timerDisplay.id = "puzzleTimer";
  timerDisplay.style.color = "white";
  timerDisplay.style.fontSize = "32px";
  timerDisplay.style.marginBottom = "20px";
  timerDisplay.textContent = `Time: ${timerDuration}s`;
  wrapper.appendChild(timerDisplay);

  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(3, 1fr)";
  container.style.gridTemplateRows = "repeat(3, 1fr)";
  container.style.gap = "6px";
  container.style.width = "95%";
  container.style.maxWidth = "900px";
  container.style.aspectRatio = "1 / 1";
  container.style.margin = "auto";
  container.style.userSelect = "none";

  const items = ["cupcake", "pizza", "partyhat"];

  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    box.style.position = "relative";
    box.style.width = "100%";
    box.style.height = "100%";

    const img = document.createElement("img");
    img.src = "images/tables.png";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";
    img.draggable = false;
    box.appendChild(img);

    let currentIndex = Math.floor(Math.random() * items.length);
    const overlay = document.createElement("img");
    overlay.src = `images/${items[currentIndex]}.png`;
    overlay.classList.add("overlay-item");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.objectFit = "contain";
    overlay.style.pointerEvents = "none";
    box.appendChild(overlay);

    box.addEventListener("click", () => {
      if (puzzleSolved) return;

      currentIndex = (currentIndex + 1) % items.length;
      overlay.src = `images/${items[currentIndex]}.png`;

      modalPlayerSequence = Array.from(container.children).map((b) =>
        b
          .querySelector(".overlay-item")
          .src.split("/")
          .pop()
          .replace(".png", "")
      );

      let correct = modalPlayerSequence.every(
        (item, idx) => item === modalCorrectSequence[idx]
      );

      if (correct) {
        puzzleSolved = true;
        clearInterval(notepadTimerInterval);
        clearTimeout(notepadTimer);
        changeBackground();

        // Play yay sound
        const yayAudio = document.getElementById("yayAudio");
        yayAudio.play();
      }
    });

    container.appendChild(box);
  }

  wrapper.appendChild(container);
  modalBody.appendChild(wrapper);
  modal.style.display = "flex";

  // ------------------ TIMER ------------------ //
  let timeLeft = timerDuration;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  // Update every second
  const notepadTimerInterval = setInterval(() => {
    if (puzzleSolved) {
      clearInterval(notepadTimerInterval);
      return;
    }

    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(notepadTimerInterval);
    }
  }, 1000);

  // Timer to trigger jumpscare & game over
  clearTimeout(notepadTimer);
  notepadTimer = setTimeout(() => {
    // Show jumpscare
    const jumpscareOverlay = document.getElementById("jumpscareOverlay");
    const jumpscareAudio = document.getElementById("jumpscareAudio");
    jumpscareOverlay.style.display = "flex";
    jumpscareAudio.play();

    // After 2 seconds → show game over
    setTimeout(() => {
      jumpscareOverlay.style.display = "none";
      modal.style.display = "none";
      document.getElementById("gameOverScreen").style.display = "flex";
    }, 2000);
  }, timerDuration * 1000);
}

// GO RIGHT FUNCTION
function goRight() {
  if (puzzleSolved) {
    window.location.href =
      "https://theinterceptoryt.github.io/MainStageFinalSolved---2/";
  } else {
    window.location.href =
      "https://theinterceptoryt.github.io/MainStageFinal---1/";
  }
}

// CHANGE BACKGROUND
function changeBackground() {
  document.body.style.backgroundImage = 'url("images/mainfloorkey.png")';
}

//-----------------------------------------------------------------------//

// Show other modal images (optional)
function showModal(imageElement) {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");
  modalImage.src = imageElement.src;
  modal.style.display = "flex";
}

function hideModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") hideModal();
});

// Ensure modal hidden on load
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("myModal").style.display = "none";
});

// Inventory toggle
function toggleBottomRow() {
  const modal = document.getElementById("myModal");

  if (modal.style.display === "flex") {
    return;
  }

  document.getElementById("bottomRow").classList.toggle("hidden");
}

// Redirect to website
function goUp() {
  window.location.href = "https://97xk27.csb.app/";
}

function goLeft() {
  window.location.href =
    "https://theinterceptoryt.github.io/ChooseHallwayFinal---1/";
}

function startMusic() {
  const audio = document.getElementById("bgAudio");
  audio.volume = 0.5;
  audio.play().catch(() => {});
  document.removeEventListener("click", startMusic);
}

document.addEventListener("click", startMusic);

function playCrumple() {
  document.getElementById("crumple").play();
}

function playPush() {
  document.getElementById("push").play();
}

// ---------------- GAME OVER RESTART ----------------- //
document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});
