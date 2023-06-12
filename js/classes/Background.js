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