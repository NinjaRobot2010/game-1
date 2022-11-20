const canvas = document.getElementById("Game");
const ctx = canvas.getContext("2d");
const menuEl = document.querySelector(".startMenu");
const pointsEl = document.querySelector("#points");
const startGameBtn = document.querySelector("#startGameBtn");
let scoreInterval;
let isGameStarted = false;

const player = {
  keyPressed: null
}

const hero = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 300,
  w: 150,
  h: 150,
  v: 20,
  fill: 'Red'
}

const score = {
  points: 0,
  x: 20,
  y: 50,
  color: 'white',
  fontSize: 48,
  fontFamily: 'Arial'
}

class Enemy {
  constructor(x, y, w, h, v) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
  }

  draw() {
    ctx.fillStyle = "MediumBlue";
    ctx.strokeStyle = "MediumBlue";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  
  update() {
    this.draw();
    this.y = this.y + this.v;
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

const projectiles = [];

window.addEventListener('click',(event) => {
  if (event.target === startGameBtn) {
    resetGame();
    animate();
    spawnEnemies();
    isGameStarted = true;
   
    // Updates score
    scoreInterval = setInterval(() => {
      score.points += 1
    }, 500);
  
    menuEl.style.display = "none";
  }

  if (event.target != startGameBtn && isGameStarted === true) {
    const projectile = new Projectile(hero.x + (hero.w / 2), hero.y + (hero.h / 2), 8, 'yellow', 15);
    projectiles.push(projectile)
  } 
});

    
const enemies = [];
let spawnInterval;

function spawnEnemies() {
   spawnInterval = setInterval( () => {

    // Enemy characteristics
    const x = Math.random() * canvas.width;
    const h = 250;
    const y = 0 - h;
    const w = 100;
    const v = 5;

    // Spawns enemy
    enemies.push(new Enemy(x,y,w,h,v));
  }, 1000)
}


// Event listener to move player
document.addEventListener("keydown", updatePlayerKey);
document.addEventListener("keyup", resetPlayerKey);

function updatePlayerKey(event) {
  switch (event.keyCode) {
    case 68:
      player.keyPressed = 'd';
      break;
    case 39:
      player.keyPressed = 'rightArrow';
      break;
    case 65:
      player.keyPressed = 'a';
      break;
    case 37:
      player.keyPressed = 'leftArrow';
      break;
  }
}

function resetPlayerKey(event) {
  // if keyup is 'd' or right arrow then reset player keyPressed to null
  if (event.keyCode === 68 && player.keyPressed === 'd') {
    player.keyPressed = null;
  }

  if (event.keyCode === 39 && player.keyPressed === 'rightArrow') {
    player.keyPressed = null;
  }

  // if keyup is 'a' or left arrow then reset player keyPressed to null
  if (event.keyCode === 65 && player.keyPressed === 'a') {
    player.keyPressed = null;
  }

  if (event.keyCode === 37 && player.keyPressed === 'leftArrow') {
    player.keyPressed = null;
  }
}


function updateHeroPosition(key) {
  if ( (key === 'd' || key === 'rightArrow') && hero.x + hero.w < canvas.width) {
    hero.x += hero.v;
  }

  if ( (key === 'a' || key === 'leftArrow') && hero.x > 0) {
    hero.x -= hero.v;
  }
}

let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);

  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Updates hero position
  updateHeroPosition(player.keyPressed);

  // Draws hero
  ctx.fillStyle = hero.fill;
  ctx.fillRect(hero.x, hero.y, hero.w, hero.h);

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
          (hero.x > enemy.x) && Math.abs(hero.x - enemy.x) <= enemy.w ||
          // or, if hero position is left of enemy
          (hero.x < enemy.x) && Math.abs(enemy.x - hero.x) <= hero.w
        ) && 
        (
          // if hero position is below enemy
          (hero.y > enemy.y) && Math.abs(hero.y - enemy.y) <= enemy.h ||
          // or, if hero position is above enemy
          (hero.y < enemy.y) && Math.abs(enemy.y - hero.y) <= hero.h
        )
    ) {
        cancelAnimationFrame(animationId);
        clearInterval(spawnInterval);
        clearInterval(scoreInterval);
        menuEl.style.display = "block";
        pointsEl.innerText = score.points;
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
  hero.x = canvas.width / 2 - 75;
  check = 2;
  score.points = 0;
}