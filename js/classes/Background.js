class Background extends Sprite {
   constructor(position = {x:0, y:0}, size = {w:0, h:0}, velocity) {
     super({position}, size, './images/seamlessForest.jpg', {x: 0, y: 0}, {w: 1000, h: 1000});
     this.velocity = velocity;
   }
 
   update() {
     this.draw();
     this.position.y = this.position.y + this.velocity;
   }
 }