var canvas = document.getElementById("Game");
var ctx = canvas.getContext("2d");

// Variable to trigger  3 different obstacles randomly 
var random = 0;

// var i1 = 0;
// var i2 = 0;
// var i3 = 0;

var hero = {
  x: canvas.width / 2 - 75,
  y: 150,
  w: 150,
  h: 150,
  fill: 'Red',
  sprite: new Image()
}

var defaultEnemy = {
  w: 100,
  h: 250,
  s: 35
}

var enemyOne = {
  x: canvas.width / 6 - 50,
  y: canvas.height,
  w: defaultEnemy.w,
  h: defaultEnemy.h,
  s: defaultEnemy.s
}

var enemyTwo = {
  x: canvas.width / 2 - 50,
  y: canvas.height,
  w: defaultEnemy.w,
  h: defaultEnemy.h,
  s: defaultEnemy.s
}

var enemyThree = {
  x: canvas.width / 6 * 5 - 50,
  y: canvas.height,
  w: defaultEnemy.w,
  h: defaultEnemy.h,
  s: defaultEnemy.s
}


// Frames per second
var frames = 60;

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


    
  // Function to draw squares
  function square(x,y,w,h) {
    ctx.fillStyle = "MediumBlue";
    ctx.strokeStyle = "MediumBlue";
    ctx.fillRect(x,y,w,h);
  }


// Returns a random integer
function getRandomNum() {
  return Math.floor(Math.random() * 3) + 1;
} 


//Triggers obstacles to move
var startBlocks = setInterval(function() {

    //Changes the random variable
    var random = getRandomNum();
    console.log(random);

    //Triggers when random = 1
    if (random === 1) {
      enemyOne.y = canvas.height;
      
      var interval1 = setInterval(function() {
        if (enemyOne.y + enemyOne.h <= 0) {
          clearInterval(interval1);
        } 
        
        enemyOne.y -= enemyOne.s;

      }, 30);
    }

    //Triggers when random = 2
    if (random === 2) {
      enemyTwo.y = canvas.height;
      
      var interval2 = setInterval(function() {
        if (enemyTwo.y + enemyTwo.h <= 0) {
          clearInterval(interval2);
        } 
        
        enemyTwo.y -= enemyTwo.s;

      }, 30);
    }

    //Triggers when random = 3
    if (random === 3) {
      enemyThree.y = canvas.height;
      
      var interval3 = setInterval(function() {
        if (enemyThree.y + enemyThree.h <= 0) {
          clearInterval(interval3);
        } 
        
        enemyThree.y -= enemyThree.s;

      }, 30);
    }
    

}, 1200);

//Changes the positions of the objects for every frame
function frameChange() {
  var startGame = setInterval(function() {

    //Clears canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Draws player
    ctx.fillStyle = hero.fill;
    ctx.fillRect(hero.x, hero.y, hero.w, hero.h);

    //Draws score
    ctx.fillStyle = "white";
    ctx.font = "75px Arial";
    ctx.fillText("Score: " + score, 75, 100);

    //Draws obstacles 
    square(enemyOne.x, enemyOne.y, enemyOne.w, enemyOne.h);
    square(enemyTwo.x, enemyTwo.y, enemyTwo.w, enemyTwo.h);
    square(enemyThree.x, enemyThree.y, enemyThree.w, enemyThree.h);


    if (Math.abs(hero.x - enemyOne.x) <= hero.w && 
        Math.abs(hero.y - enemyOne.y) <= hero.h) {
      clearInterval(startGame);
      clearInterval(startBlocks);
    }

    if (Math.abs(hero.x - enemyTwo.x) <= hero.w && 
        Math.abs(hero.y - enemyTwo.y) <= hero.h) {
      clearInterval(startGame);
      clearInterval(startBlocks);
    }

    if (Math.abs(hero.x - enemyThree.x) <= hero.w && 
        Math.abs(hero.y - enemyThree.y) <= hero.h) {
      clearInterval(startGame);
      clearInterval(startBlocks);
    }

  }, 1000 / frames);
}

frameChange();

//Changes score by 1 every 0.5 seconds
var score = 0;
setInterval(function() {
  score += 1
}, 500);