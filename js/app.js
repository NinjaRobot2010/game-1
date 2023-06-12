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

const backgrounds = [];

function addBackgrounds(bgImgs) {
  bgImgs.forEach((bg, index) => {
    const prevBg = index === 0 ? null : backgrounds[index - 1];
    const bgYcoordinate = prevBg ? prevBg.position.y - canvas.height : 0;
    backgrounds.push(new Background({x: 0, y: bgYcoordinate}, {w: canvas.width, h: canvas.height}, 1));
  })
}

function updateBackgroundPosition() {
  for (let i = 0; i < backgrounds.length; i++) {
    // If any background has reached bottom of canvas
    if (backgrounds[i].position.y >= canvas.height) {
      // Update position of bg to be on top of last bg in backgrounds array
      backgrounds[i].position.y = backgrounds[backgrounds.length - 1].position.y - backgrounds[i].size.h;
      // put bg to the back of backgrounds array
      const bottomBg = backgrounds.splice(i, 1);
      backgrounds.push(bottomBg[0]);
    }
    backgrounds[i].update();
  }
}


const projectiles = [];

window.addEventListener('mousedown',(event) => {
  // If START button is clicked, start a new game
  if (event.target === startGameBtn) {
    startNewGame();
    menuEl.style.display = "none";
  }

  if (event.target != startGameBtn && isGameStarted === true) {
    const projectile = new Projectile(
      {
        x: hero.position.x + (hero.size.w / 2), 
        y: hero.position.y + (hero.size.h / 2)
      }, 
      8, 
      'yellow', 
      10
    );
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
    const size = {w: 64, h: 64};
    const position = {
      x: Math.random() * canvas.width, 
      y: 0 - size.h
    };
    const hitboxSize = {
      w: 36,
      h: 28 / 2
    };
    velocity = 2;

    // Spawns enemy
    enemies.push(new Enemy(position, size, hitboxSize, velocity));
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
  if ( (key === 'd' || key === 'rightArrow') && hero.position.x + hero.size.w < canvas.width) {
    hero.update('right');
  }

  if ( (key === 'a' || key === 'leftArrow') && hero.position.x > 0) {
    hero.update('left')
  }
}

let animationId;

// canvas.addEventListener('mousemove', event => console.log(event.clientY))

function animate() {
  animationId = requestAnimationFrame(animate);

  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update backgrounds position
  updateBackgroundPosition();

  // Updates hero position
  if (player.keyPressed) {updateHeroPosition(player.keyPressed)}
  
  // Draws hero
  hero.draw();

  // Draws score
  ctx.fillStyle = score.color;
  ctx.font = `${score.fontSize}px ${score.fontFamily}`;
  ctx.fillText(`Score: ${score.points}`, score.x, score.y);

  // Loops through enemies array
  enemies.forEach((enemy, enemyIndex) => {
    // Removes enemies off screen
    if (enemy.position.y < 0 - enemy.size.h) {
      setTimeout(() => {
        enemies.splice(enemyIndex, 1);
      }, 0)
    }

    // Collision detection for hero
    if (
        (
          // if hero position is right of enemy
          hero.hitboxPosition.x > enemy.hitboxPosition.x && Math.abs(hero.hitboxPosition.x - enemy.hitboxPosition.x) <= enemy.hitboxSize.w ||
          // or, if hero position is left of enemy
          hero.hitboxPosition.x < enemy.hitboxPosition.x && Math.abs(enemy.hitboxPosition.x - hero.hitboxPosition.x) <= hero.hitboxSize.w
        ) 
        && 
        (
          // if hero position is below enemy
          hero.hitboxPosition.y > enemy.hitboxPosition.y && Math.abs(hero.hitboxPosition.y - enemy.hitboxPosition.y) <= enemy.hitboxSize.h ||
          // or, if hero position is above enemy
          hero.hitboxPosition.y < enemy.hitboxPosition.y && Math.abs(enemy.hitboxPosition.y - hero.hitboxPosition.y) <= hero.hitboxSize.h
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
          (projectile.position.y > enemy.hitboxPosition.y) && Math.abs( (projectile.position.y - projectile.radius) - enemy.hitboxPosition.y) <= enemy.hitboxSize.h &&
          (projectile.position.x + projectile.radius) > enemy.hitboxPosition.x && (projectile.position.x - projectile.radius) < (enemy.hitboxPosition.x + enemy.hitboxSize.w)
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
    if (projectile.position.y < 0 - projectile.radius) {
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
    {x: canvas.width / 2 - 32, y: canvas.height - 144}, // position
    {w: 64, h: 64}, // size
    {w: 60 / 2, h: 52 / 2}, // hitboxSize
    2 // velocity
  );
  score.points = 0;
  backgrounds.length = 0;
  addBackgrounds(bgImages);
}