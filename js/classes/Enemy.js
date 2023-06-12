class Enemy extends Sprite {
   constructor(position = {x:0, y:0}, size = {w:0, h:0}, hitboxSize = {w:0, h:0}, velocity) {
     super({position}, size, './images/enemies.png', {x: 192, y: 0}, {w:64, h:64});
     this.hitboxSize = hitboxSize;
     this.hitboxPosition = {
      x: this.position.x + ((this.size.w - this.hitboxSize.w) / 2),
      y: this.position.y + ((this.size.h - this.hitboxSize.h) / 2)
     };
     this.velocity = velocity;
   }
   
   update() {
     this.draw();
     this.position.y += this.velocity;
     this.hitboxPosition.y = this.position.y + ((this.size.h - this.hitboxSize.h) / 2);
   }
 }