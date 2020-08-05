const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Переменные
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

// Слушатели
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});
document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, r, s, e, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.s = s;
    this.e = e;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 20;
    this.originalHeight = this.r * 2;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {
    // Прыжок
    if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    this.y += this.dy;

    //Гравитация
    if (this.y + this.r < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.r;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer == 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpForce;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 50;
    }
  }

  Draw() {
    ctx.fillStyle = this.c;
    ctx.arc(this.x, this.y, this.r, this.s, this.e);
    ctx.fill();
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx + 1;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

// Игровые функции
function SpawnObstacle() {
  let size = RandomIntInRange(50, 100);
  let obstacle = new Obstacle(
    canvas.width + size,
    canvas.height - size,
    size,
    size,
    "#2484E4"
  );
  obstacles.push(obstacle);
}

function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Start() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gameSpeed = 3;
  gravity = 1;

  player = new Player(
    canvas.width / 2,
    canvas.height - 50,
    50,
    0,
    2 * Math.PI,
    "red"
  );

  requestAnimationFrame(Update);
}

let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;
  if (spawnTimer <= 0) {
    SpawnObstacle();
    console.log(obstacles);
    spawnTimer = initialSpawnTimer - gameSpeed * 8;

    if (spawnTimer < 60) {
      spawnTimer = 60;
    }
  }

  // Создание кубиков
  for (let i = 0; i < obstacles.length; i++) {
    let o = obstacles[i];

    if (o.x + o.w < 0) {
      obstacles.splice(i, 1);
    }

    if (
      player.x < o.x + o.w &&
      player.x + player.r > o.x &&
      player.y < o.y + o.h &&
      player.y + player.r > o.y
    ) {
      obstacles = [];
      spawnTimer = initialSpawnTimer;
      gameSpeed = 3;
    }

    o.Update();
  }

  player.Animate();

  gameSpeed += 0.003;
}

Start();
