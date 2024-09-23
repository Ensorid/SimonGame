const colors = ["green", "red", "blue", "yellow"];
const bestscore = getCookie("bestscore");
let gameSequence = [];
let playerSequence = [];
let level = 0;
let isGameActive = false;

document.getElementById("start-button").addEventListener("click", startGame);

colors.forEach((color) => {
  document
    .getElementById(color)
    .addEventListener("click", () => handleUserClick(color));
});

function startGame() {
  isGameActive = true;
  level = 0;
  gameSequence = [];
  nextSequence();
}

function nextSequence() {
  playerSequence = [];
  if (level > 0) {
    const audio = new Audio("assets/sounds/levelup.mp3");
    audio.play();
  }
  level++;
  document.querySelector("#default-text").innerText = `Level ${level}`;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSequence.push(randomColor);
  playSequence();
}

function playSequence() {
  document.querySelectorAll(".quart").forEach((element) => {
    element.classList.add("disabled");
  });
  let index = 0;
  const interval = setInterval(() => {
    if (index >= gameSequence.length) {
      clearInterval(interval);
      return;
    }
    flashColor(gameSequence[index]);
    index++;
  }, 300);
  document.querySelectorAll(".quart").forEach((element) => {
    element.classList.remove("disabled");
  });
}

function flashColor(color) {
  const element = document.getElementById(color);
  element.classList.add("active");
  setTimeout(() => {
    const audio = new Audio("assets/sounds/" + color + ".mp3");
    audio.play();
    element.classList.remove("active");
  }, 200);
}

function handleUserClick(color) {
  if (!isGameActive) return;
  playerSequence.push(color);
  flashColor(color);
  checkSequence();
}

function checkSequence() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== gameSequence[i]) {
      gameOver();
      return;
    }
  }

  if (playerSequence.length === gameSequence.length) {
    setTimeout(nextSequence, 1000);
  }
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function updateBScore() {
  if (bestscore > 0) {
    document.getElementById("bestscore").innerText =
      "Your best score is : " + bestscore;
  }
}

function gameOver() {
  isGameActive = false;
  if (bestscore < level) {
    setCookie("bestscore", level, 365);
  }
  alert("You loose ! Your score : " + level);
  location.reload();
}
updateBScore();
