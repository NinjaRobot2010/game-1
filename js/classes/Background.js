class Background extends Sprite {
   constructor(position = {x:0, y:0}, size = {w:0, h:0}, imgSrc, velocity) {
     super({position}, size, imgSrc, {x: 0, y: 0}, size);
     this.velocity = velocity;
   }
 
   update() {
     this.draw();
     this.position.y = this.position.y + this.velocity;
   }
 }