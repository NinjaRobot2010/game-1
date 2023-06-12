const canvas = document.getElementById("Game");
const ctx = canvas.getContext("2d");
const menuEl = document.querySelector(".startMenu");
const pointsEl = document.querySelector("#points");
const startGameBtn = document.querySelector("#startGameBtn");
let scoreInterval;
let isGameStarted = false;
let soundtrack = new Audio('./sound/soundtrack.mp3');
soundtrack.loop = true;
let hero;
// Game background will continuously loop through bgImages in order. Must have at least two image sources (strings) in array.
const bgImages = [
  './images/seamlessForest.jpg',
  './images/seamlessForest.jpg'
];

const player = {
  keyPressed: null
}

class Hero {
  constructor(x, y, w, h, v, spriteW, spriteH) {
    this.img = new Image();
    this.img.src = './images/hero.png';
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
    this.spriteW = spriteW;
    this.spriteH = spriteH;
    this.hitboxX = this.x + ((this.w - this.spriteW) / 2);
    this.hitboxY = this.y + ((this.h - this.spriteH) / 2);
  }

  draw() {
    ctx.drawImage(this.img, 0, 0, 64, 64, this.x, this.y, this.w, this.h);

    ctx.strokeStyle = "green";
    ctx.strokeRect(
      this.x,
      this.y,
      this.w,
      this.h
    )

    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.hitboxX, 
      this.hitboxY, 
      this.spriteW, 
      this.spriteH
    );
  }
  
  update() {
    this.draw();
    this.x = this.x + this.v;
    this.hitboxX = this.x + ((this.w - this.spriteW) / 2);
  }
}

const score = {
  points: 0,
  x: 15,
  y: 30,
  color: 'white',
  fontSize: 24,
  fontFamily: 'Arial'
}

keyMap = {
  leftArrow: 37,
  rightArrow: 39,
  a: 65,
  d: 68
}

class Enemy {
  constructor(x, y, w, h, v, spriteW, spriteH) {
    this.img = new Image();
    this.img.src = './images/enemies.png';
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
    this.spriteW = spriteW;
    this.spriteH = spriteH;
    this.hitboxX = this.x + ((this.w - this.spriteW) / 2);
    this.hitboxY = this.y + ((this.h - this.spriteH) / 2);
  }

  draw() {
    ctx.drawImage(this.img, 192, 0, 64, 64, this.x, this.y, this.w, this.h);

    ctx.strokeStyle = "green";
    ctx.strokeRect(
      this.x,
      this.y,
      this.w,
      this.h
    )

    ctx.strokeStyle = "red";
    ctx.strokeRect(
      this.hitboxX, 
      this.hitboxY, 
      this.spriteW, 
      this.spriteH
    );
  }
  
  update() {
    this.draw();
    this.y = this.y + this.v;
    this.hitboxY = this.y + ((this.h - this.spriteH) / 2);
  }
}

class Projectile {
  constructor(x, y, r, color, v) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
    this.v = v;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.y = this.y - this.v;
  }
}


class Background {
  constructor(imgEl, x, y, w, h, v) {
    this.imgEl = imgEl;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
  }

  draw() {
    ctx.drawImage(this.imgEl, this.x, this.y, this.w, this.h);
  }

  update() {
    this.draw();
    this.y = this.y + this.v;
  }
}

const backgrounds = [];

function createBgs(bgImgs) {
  bgImgs.forEach((img, index) => {
    const bgEl = new Image();
    bgEl.src = img;
    const prevBg = index === 0 ? null : backgrounds[index - 1];
    const bgYcoordinate = prevBg ? prevBg.y - canvas.height : 0;
    backgrounds.push(new Background(bgEl, 0, bgYcoordinate, canvas.width, canvas.height, 1));
  })
}

const projectiles = [];

window.addEventListener('mousedown',(event) => {
  // If START button is clicked, start a new game
  if (event.target === startGameBtn) {
    startNewGame();
    menuEl.style.display = "none";
  }

  if (event.target != startGameBtn && isGameStarted === true) {
    const projectile = new Projectile(hero.x + (hero.w / 2), hero.y + (hero.h / 2), 8, 'yellow', 10);
    projectiles.push(projectile)

    let heroShoot = new Audio('./sound/hero_shoot.wav');
    heroShoot.play();

  } 
});

function startNewGame() {
  resetGame();
  animate();
  spawnEnemies();
  soundtrack.play();
  isGameStarted = true;
  
  // Updates score
  scoreInterval = setInterval(() => {
    score.points += 1
  }, 500);
}

    
const enemies = [];
let spawnInterval;

function spawnEnemies() {
   spawnInterval = setInterval( () => {

    // Enemy characteristics
    const x = Math.random() * canvas.width;
    const h = 64;
    const y = 0 - h;
    const w = 64
    const v = 2;
    const spriteW = 36;
    const spriteH = 28 / 2;

    // Spawns enemy
    enemies.push(new Enemy(x, y, w, h, v, spriteW, spriteH));
  }, 1000)
}

// Event listener to move player
document.addEventListener("keydown", updatePlayerKey);
document.addEventListener("keyup", resetPlayerKey);

function updatePlayerKey(event) {
  switch (event.keyCode) {
    case keyMap.d:
      player.keyPressed = 'd';
      break;
    case keyMap.rightArrow:
      player.keyPressed = 'rightArrow';
      break;
    case keyMap.a:
      player.keyPressed = 'a';
      break;
    case keyMap.leftArrow:
      player.keyPressed = 'leftArrow';
      break;
  }
}

function resetPlayerKey(event) {
  // if keyup is 'd' or right arrow then reset player keyPressed to null
  if (event.keyCode === keyMap.d && player.keyPressed === 'd') {
    player.keyPressed = null;
  }
  if (event.keyCode === keyMap.rightArrow && player.keyPressed === 'rightArrow') {
    player.keyPressed = null;
  }

  // if keyup is 'a' or left arrow then reset player keyPressed to null
  if (event.keyCode === keyMap.a && player.keyPressed === 'a') {
    player.keyPressed = null;
  }
  if (event.keyCode === keyMap.leftArrow && player.keyPressed === 'leftArrow') {
    player.keyPressed = null;
  }
}


function updateHeroPosition(key) {
  const heroHitboxWDif = (hero.w - hero.spriteW) / 2;

  if ( (key === 'd' || key === 'rightArrow') && hero.x + hero.w < canvas.width) {
    hero.x += hero.v;
    hero.hitboxX = hero.x + heroHitboxWDif;
  }

  if ( (key === 'a' || key === 'leftArrow') && hero.x > 0) {
    hero.x -= hero.v;
    hero.hitboxX = hero.x + heroHitboxWDif;
  }
}

function updateBgPos() {
  for (let i = 0; i < backgrounds.length; i++) {
    // If any background has reached bottom of canvas
    if (backgrounds[i].y >= canvas.height) {
      // Update position of bg to be on top of last bg in backgrounds array
      backgrounds[i].y = backgrounds[backgrounds.length - 1].y - backgrounds[i].h;
      // put bg to the back of backgrounds array
      const bottomBg = backgrounds.splice(i, 1);
      backgrounds.push(bottomBg[0]);
    }
    backgrounds[i].update();
  }
}

let animationId;

// canvas.addEventListener('mousemove', event => console.log(event.clientY))

function animate() {
  animationId = requestAnimationFrame(animate);

  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update backgrounds position
  updateBgPos();

  // Updates hero position
  updateHeroPosition(player.keyPressed);

  // Draws hero
  hero.img.src = './images/hero.png';
  ctx.drawImage(hero.img, 0, 0, 64, 64, hero.x, hero.y, hero.w, hero.h);

  ctx.strokeStyle = "green";
  ctx.strokeRect(
    hero.x,
    hero.y,
    hero.w,
    hero.h
  );
  
  ctx.strokeStyle = "red";
  ctx.strokeRect(
    hero.hitboxX,
    hero.hitboxY,
    hero.spriteW,
    hero.spriteH
  );

  // Draws score
  ctx.fillStyle = score.color;
  ctx.font = `${score.fontSize}px ${score.fontFamily}`;
  ctx.fillText(`Score: ${score.points}`, score.x, score.y);

  // Loops through enemies array
  enemies.forEach((enemy, enemyIndex) => {
    // Removes enemies off screen
    if (enemy.y < 0 - enemy.h) {
      setTimeout(() => {
        enemies.splice(enemyIndex, 1);
      }, 0)
    }

    
    // Collision detection for hero
    if (
        (
          // if hero position is right of enemy
          hero.hitboxX > enemy.hitboxX && Math.abs(hero.hitboxX - enemy.hitboxX) <= enemy.spriteW ||
          // or, if hero position is left of enemy
          hero.hitboxX < enemy.hitboxX && Math.abs(enemy.hitboxX - hero.hitboxX) <= hero.spriteW
        ) 
        && 
        (
          // if hero position is below enemy
          hero.hitboxY > enemy.hitboxY && Math.abs(hero.hitboxY - enemy.hitboxY) <= enemy.spriteH ||
          // or, if hero position is above enemy
          hero.hitboxY < enemy.hitboxY && Math.abs(enemy.hitboxY - hero.hitboxY) <= hero.spriteH
        )
    ) {
        cancelAnimationFrame(animationId);
        clearInterval(spawnInterval);
        clearInterval(scoreInterval);
        menuEl.style.display = "block";
        pointsEl.innerText = score.points;
        soundtrack.pause();
        soundtrack.currentTime = 0;
        let heroExplosion = new Audio('./sound/hero_explosion.wav');
        heroExplosion.play();
        isGameStarted = false;
    }

     // Collision detection for projectiles
     // Loop through projectiles array
     projectiles.forEach((projectile, projectileIndex) => {
      // if projectile position is below enemy
      if ( 
          // if projectile position is below enemy
          (projectile.y > enemy.y) && Math.abs( (projectile.y - projectile.r) - enemy.y) <= enemy.h &&
          (projectile.x + projectile.r) > enemy.x && (projectile.x - projectile.r) < (enemy.x + enemy.w)
          ) {
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
        score.points += 10;
        let enemyExplosion = new Audio('./sound/enemy_explosion.wav');
        enemyExplosion.play();
      }
    })

    // Draws enemy and updates their position
    enemy.update();
  })

  // Loop through projectiles array
  projectiles.forEach((projectile, index) => {
    // Removes projectiles off screen
    if (projectile.y < 0 - projectile.r) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0)
    }

    // Draws projectile and updates their position
    projectile.update();
  })
}

function resetGame() {
  enemies.length = 0;
  hero = new Hero(
    canvas.width / 2 - 32, 
    canvas.height - 144, 
    64, 
    64, 
    1, 
    60 / 2, 
    52 / 2
  );
  score.points = 0;
  backgrounds.length = 0;
  createBgs(bgImages);
}