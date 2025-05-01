const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bgImage = new Image();
bgImage.src = "assets/background.jpg";

const playerFrames = [
  new Image(),
  new Image()
];
playerFrames[0].src = "assets/player.png"; // стоїть
playerFrames[1].src = "assets/playerMIF.png"; // дихає

let player = {
  x: 400,
  y: 300,
  speed: 3,
  width: 32,
  height: 32,
  currentFrame: 0,
  lastFrameTime: 0,
  isMoving: false
};

const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function update(deltaTime) {
  let moving = false;

  if (keys["ArrowUp"])  { player.y -= player.speed; moving = true; }
  if (keys["ArrowDown"]) { player.y += player.speed; moving = true; }
  if (keys["ArrowLeft"]) { player.x -= player.speed; moving = true; }
  if (keys["ArrowRight"]) { player.x += player.speed; moving = true; }

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  player.isMoving = moving;

  // Якщо не рухається — перемикати кадри кожні 500 мс
  if (!player.isMoving) {
    if (performance.now() - player.lastFrameTime > 500) {
      player.currentFrame = (player.currentFrame + 1) % 2;
      player.lastFrameTime = performance.now();
    }
  } else {
    player.currentFrame = 0; // Завжди перший кадр під час руху
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  const frameImage = playerFrames[player.currentFrame];
  ctx.drawImage(frameImage, player.x, player.y, player.width, player.height);
}

let lastTime = 0;
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();
  requestAnimationFrame(gameLoop);
}

bgImage.onload = () => {
  playerFrames[0].onload = () => {
    playerFrames[1].onload = () => {
      gameLoop();
    };
  };
};
