const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgImage = new Image();
bgImage.src = "assets/background.jpg";

const playerFrames = [
  new Image(),
  new Image()
];
playerFrames[0].src = "assets/player.png"; // стоїть
playerFrames[1].src = "assets/playerMIFF.png"; // дихає

let mapWidth = 1600;  // розмір карти (фон)
let mapHeight = 1200;

let player = {
  x: mapWidth / 2,
  y: mapHeight / 2,
  speed: 4,
  width: 32,
  height: 32,
  currentFrame: 0,
  lastFrameTime: 0,
  isMoving: false
};

const keys = {};
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

function update(deltaTime) {
  let moving = false;

  if (keys["W"]) { player.y -= player.speed; moving = true; }
  if (keys["S"]) { player.y += player.speed; moving = true; }
  if (keys["A"]) { player.x -= player.speed; moving = true; }
  if (keys["D"]) { player.x += player.speed; moving = true; }

  // Межі карти
  player.x = Math.max(0, Math.min(mapWidth - player.width, player.x));
  player.y = Math.max(0, Math.min(mapHeight - player.height, player.y));

  player.isMoving = moving;

  if (!player.isMoving) {
    if (performance.now() - player.lastFrameTime > 500) {
      player.currentFrame = (player.currentFrame + 1) % 2;
      player.lastFrameTime = performance.now();
    }
  } else {
    player.currentFrame = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Центр камери — персонаж
  const camX = player.x - canvas.width / 2 + player.width / 2;
  const camY = player.y - canvas.height / 2 + player.height / 2;

  // Малюємо фон з урахуванням камери
  ctx.drawImage(bgImage, -camX, -camY, mapWidth, mapHeight);

  // Малюємо гравця в центрі екрану
  const frameImage = playerFrames[player.currentFrame];
  const drawX = canvas.width / 2 - player.width / 2;
  const drawY = canvas.height / 2 - player.height / 2;
  ctx.drawImage(frameImage, drawX, drawY, player.width, player.height);
}

let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();
  requestAnimationFrame(gameLoop);
}

// Зміна розміру вікна
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

bgImage.onload = () => {
  playerFrames[0].onload = () => {
    playerFrames[1].onload = () => {
      gameLoop();
    };
  };
};
