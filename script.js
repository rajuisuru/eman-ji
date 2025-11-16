/* ---------------- TIMER (your existing code, unchanged) ---------------- */

const startDate = new Date("2025-05-22T02:16:00+05:30");

function updateTimer() {
  const now = new Date();

  const utcStart = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const utcNow = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const dayDiff = utcNow - utcStart;
  const days = Math.floor(dayDiff / (1000 * 60 * 60 * 24));

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  document.getElementById("timer").innerHTML =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💖`;
}

setInterval(updateTimer, 1000);
updateTimer();



/* ---------------- MUSIC PLAYER ---------------- */

// Add your song files here (must match your filenames exactly)
const songs = [
  "Main Tera.m4a",
  "creep.m4a",
  "pehli dafa.m4a",
  "fly me to the moon.m4a",
  "oo saathi.m4a",
  "perfect.m4a",
  "they call this love.m4a",
  "what do u mean.m4a"
];

let currentSongIndex = 0;
const music = new Audio(songs[currentSongIndex]);
music.volume = 0.9;
music.loop = false;

// When one song finishes, stick to the loop
music.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  music.src = songs[currentSongIndex];
  music.play();
});

// Floating button click → play music
document.getElementById("musicButton").addEventListener("click", () => {
  music.play();
  document.getElementById("musicButton").innerText = "💜"; // changes icon after click
});



/* ---------------- FLOATING HEARTS (optional, from earlier) ---------------- */

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerText = "💖";  // upright heart emoji
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 4 + Math.random() * 5 + "s";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 9000);
}



