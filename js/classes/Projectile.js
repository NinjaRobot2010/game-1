class Projectile {
   constructor(position = {x:0, y:0}, radius, color, velocity) {
     this.position = position;
     this.radius = radius;
     this.color = color;
     this.velocity = velocity;
   }
 
   draw() {
     ctx.beginPath();
     ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
     ctx.fillStyle = this.color;
     ctx.fill();
   }
 
   update() {
     this.draw();
     this.position.y -= this.velocity;
   }
 }