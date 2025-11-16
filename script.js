/* ---------------- TIMER ---------------- */

const startDate = new Date(Date.UTC(2025, 4, 21, 20, 46, 0));  // 22 May 2025, 2:16 AM IST

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  if (diff < 0) return; // safety check

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer").innerHTML =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💖`;
}

setInterval(updateTimer, 1000);
updateTimer();

/* ---------------- SONG PLAYER ---------------- */

// Add your song file names here
const songs = [
  "Main Tera.m4a",
  "creep.m4a",
  "fly me to the moon.m4a",
  "pehli dafa.m4a"
];

let currentSongIndex = 0;
const music = new Audio(songs[currentSongIndex]);
music.volume = 0.9;

music.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  music.src = songs[currentSongIndex];
  music.play();
});

// play on button click
document.getElementById("musicButton").addEventListener("click", () => {
  music.play();
  document.getElementById("musicButton").innerText = "💜";
});


/* ---------------- FLOATING HEARTS ---------------- */

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 4 + Math.random() * 5 + "s";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 9000);
}

setInterval(createHeart, 400);

