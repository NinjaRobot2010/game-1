var canvas = document.getElementById("Game");
var ctx = canvas.getContext("2d");

var hero = {
  x: canvas.width / 2 - 75,
  y: 150,
  w: 150,
  h: 150,
  fill: 'Red',
  sprite: new Image()
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
    this.y = this.y - this.v;
  }
}

// Event listener to move player
document.addEventListener("keydown", key);

var check = 2;

//Keys to move player
function key(event){
  console.log(check);

  //Key D
  if (event.keyCode === 68 ) {
    if (check < 3) {
      check = check + 1 ;
      hero.x = hero.x + 1900 / 3;
    }
  }

  //Key A
  if (event.keyCode === 65) {
    if (check > 1) {
      check = check - 1;
      hero.x = hero.x - 1900 / 3;
    }
  }

  // Left arrow
  if (event.keyCode === 37 ) {
    if (check > 1) {
      check = check - 1;
      hero.x = hero.x - 1900 / 3;
    }
  }

  // Right arrow
  if (event.keyCode === 39) {
    if (check < 3) {
      check = check + 1 ;
      hero.x = hero.x + 1900 / 3;
    }
  }
}


// Returns a random integer
function getRandomNum() {
  return Math.floor(Math.random() * 3) + 1;
} 

const enemies = [];
let spawnInterval;

function spawnEnemies() {
   spawnInterval = setInterval( () => {
    let x;
    const y = canvas.height;
    const w = 100;
    const h = 250;
    const v = 10;
    
    const column = getRandomNum();
    switch(column) {
      case 1:
        x = canvas.width / 6 - 50;
        break;
      case 2:
        x = canvas.width / 2 - 50;
        break;
      case 3:
        x = canvas.width / 6 * 5 - 50
    }

    enemies.push(new Enemy(x, y, w, h, v));

  }, 1000)
}

let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);

  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draws hero
  ctx.fillStyle = hero.fill;
  ctx.fillRect(hero.x, hero.y, hero.w, hero.h);

  // Draws score
  // ctx.fillStyle = "white";
  // ctx.font = "75px Arial";
  // ctx.fillText("Score: " + score, 75, 100);

  enemies.forEach((enemy, index) => {
    // Removes enemies off screen
    if (enemy.y < 0 - enemy.h) {
      setTimeout(() => {
        enemies.splice(index, 1);
      }, 0)
    }

    // Collision detection
    if ( Math.abs(hero.x - enemy.x) <= hero.w && 
    Math.abs(hero.y - enemy.y) <= hero.h ) {
      cancelAnimationFrame(animationId);
      clearInterval(spawnInterval);

    }

    enemy.update();
  })
}

animate();
spawnEnemies();

//Changes score by 1 every 0.5 seconds
// var score = 0;
// setInterval(function() {
//   score += 1
// }, 500);