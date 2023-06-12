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