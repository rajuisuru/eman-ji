console.log("Songs loaded:", songs);

songs.forEach(src => {
  fetch(src)
    .then(r => console.log(src, "status:", r.status))
    .catch(err => console.log("Error with", src, err));
});


const startDate = new Date("2025-05-22T02:16:00+05:30");

function updateTimer() {
  const now = new Date();

  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer").innerHTML =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💖`;
}

setInterval(updateTimer, 1000);
updateTimer();


/* ---------------- PLAYLIST MUSIC ---------------- */

// Add your filenames here
const songs = [
  "Main Tera.m4a",
  "creep.m4a",
  "fly me to the moon.m4a",
  "oo saathi.m4a",
  "pehli dafa.m4a",
  "perfect.m4a",
  "they call this love.m4a",
  "what do u mean.m4a"
];

let currentIndex = 0;
const music = new Audio(songs[currentIndex]);
music.volume = 0.9;
music.loop = false;

music.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  music.src = songs[currentIndex];
  music.play();
});

// floating button click
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

