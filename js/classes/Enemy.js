class Enemy {
   constructor(x, y, w, h, v, spriteW, spriteH) {
     this.img = new Image();
     this.img.src = './images/enemies.png';
     this.x = x;
     this.y = y;
     this.w = w;
     this.h = h;
     this.v = v;
     this.spriteW = spriteW;
     this.spriteH = spriteH;
     this.hitboxX = this.x + ((this.w - this.spriteW) / 2);
     this.hitboxY = this.y + ((this.h - this.spriteH) / 2);
   }
 
   draw() {
     ctx.drawImage(this.img, 192, 0, 64, 64, this.x, this.y, this.w, this.h);
 
     ctx.strokeStyle = "green";
     ctx.strokeRect(
       this.x,
       this.y,
       this.w,
       this.h
     )
 
     ctx.strokeStyle = "red";
     ctx.strokeRect(
       this.hitboxX, 
       this.hitboxY, 
       this.spriteW, 
       this.spriteH
     );
   }
   
   update() {
     this.draw();
     this.y = this.y + this.v;
     this.hitboxY = this.y + ((this.h - this.spriteH) / 2);
   }
 }