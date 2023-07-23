const canvas = document.getElementById("Game");
const ctx = canvas.getContext("2d");
const title = document.querySelector("#title");
const menuEl = document.querySelector(".startMenu");
const pointsEl = document.querySelector("#points");
const startGameBtn = document.querySelector("#startGameBtn");
let scoreInterval;
let isGameOn = false;
let soundtrack = new Audio('./sound/soundtrack.mp3');
soundtrack.loop = true;
let hero;
// Order in which background images appear (must be > 1 image)
const bgImgReel = [
  './images/space_background-0.png',
  './images/space_background-1.png',
  './images/space_background-2.png',
  './images/space_background-3.png'
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
  fontFamily: 'Arial',
  level: 0
}

keyMap = {
  leftArrow: 37,
  rightArrow: 39,
  a: 65,
  d: 68
}

const backgrounds = [];

function addBackgrounds(bgImgs) {
  bgImgs.forEach((imgSource, index) => {
    const prevBg = index === 0 ? null : backgrounds[index - 1];
    const bgYcoordinate = prevBg ? prevBg.position.y - canvas.height : 0;
    backgrounds.push(new Background({x: 0, y: bgYcoordinate}, {w: canvas.width, h: canvas.height}, imgSource, 1));
  })
}

function updateBackgroundPosition() {
  for (let i = 0; i < backgrounds.length; i++) {
    // If any background has reached bottom of canvas
    if (backgrounds[i].position.y >= canvas.height) {
      // Update position of bg to be on top of last bg in backgrounds array
      backgrounds[i].position.y = backgrounds[backgrounds.length - 1].position.y - backgrounds[i].size.h;
      // Put bg to the back of backgrounds array
      const frontBg = backgrounds.splice(i, 1);
      backgrounds.push(frontBg[0]);
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
    title.style.display = "none";
  }

  if (event.target != startGameBtn && isGameOn === true) {
    const projectile = new Projectile(
      {
        x: hero.position.x + (hero.size.w / 2), 
        y: hero.position.y + (hero.size.h / 2)
      }, 
      5, 
      'yellow', 
      6
    );
    projectiles.push(projectile)

    let heroShoot = new Audio('./sound/hero_shoot.wav');
    heroShoot.play();
  } 
});

function startNewGame() {
  resetGame();
  isGameOn = true;
  animate();
  soundtrack.play();

  // Updates score
  scoreInterval = setInterval(() => {
    score.points += 1
  }, 500);
}

    
const enemies = [];
let spawnInterval;

function spawnEnemies(interval, velocity = {x:0, y:0}) {
  console.log('spawnEnemies executed');
  
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

    // Spawns enemy
    enemies.push(new Enemy(position, size, hitboxSize, velocity));
  }, interval)
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
        isGameOn = false;
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
    enemy.update(hero.position);
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


  // Updates hero position
  if (player.keyPressed) {updateHeroPosition(player.keyPressed)}
  
  // Draws hero
  hero.draw();

  manageDifficulty();
}

function manageDifficulty() {
    // level 1
    if (score.points >= 0 && score.level < 1) {
      score.level++;
      spawnEnemies(1000, {x:1, y:2});
    // level 2
    } else if (score.points >= 100 && score.level < 2) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(750, {x:1, y:2});
      // level 3
    } else if (score.points >= 250 && score.level < 3) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(500, {x:1, y:2});
      // level 4
    } else if (score.points >= 500 && score.level < 4) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(250, {x:1, y:2});
      // level 5
    } else if (score.points >= 1000 && score.level < 5) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(250, {x:1, y:3});
      // level 6
    } else if (score.points >= 2000 && score.level < 6) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(250, {x:1, y:3});
      // level 7
    } else if (score.points >= 3000 && score.level < 7) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(200, {x:1, y:4});
      // level 8
    } else if (score.points >= 3500 && score.level < 8) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(150, {x:1, y:4});
    }
    // level 9
    else if (score.points >= 4000 && score.level < 9) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(75, {x:1, y:5});
    }
    // level 10
    else if (score.points >= 4500 && score.level < 10) {
      clearInterval(spawnInterval);
      score.level++;
      spawnEnemies(50, {x:1, y:5});
    }
}

function resetGame() {
  enemies.length = 0;
  projectiles.length = 0;
  hero = new Hero(
    {x: canvas.width / 2 - 32, y: canvas.height - 144}, // position
    {w: 64, h: 64}, // size
    {w: 60 / 2, h: 52 / 2}, // hitboxSize
    {x:3, y:0} // velocity
  );
  score.points = 0;
  score.level = 0;
  backgrounds.length = 0;
  addBackgrounds(bgImgReel);
}