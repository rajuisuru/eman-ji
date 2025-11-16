// Set your date here
const startDate = new Date("2025-05-22T02:16:00+05:30");

function updateTimer() {
  const now = new Date();

  // Covert both dates to UTC at midnight
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

  // Local time ticking
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  document.getElementById("timer").innerHTML =
    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💖`;
}

setInterval(updateTimer, 1000);
updateTimer();
