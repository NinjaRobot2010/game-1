class Sprite {
   constructor({ position = {x:0, y:0} }, size, imgSrc, spriteLoc, spriteSize) {
      this.position = position
      this.size = size;
      this.img = new Image();
      this.img.src = imgSrc;
      this.spriteLoc = spriteLoc;
      this.spriteSize = spriteSize;
   }

   draw() {
      ctx.drawImage(
         this.img,
         this.spriteLoc.x,
         this.spriteLoc.y,
         this.spriteSize.w,
         this.spriteSize.h,
         this.position.x,
         this.position.y,
         this.size.w,
         this.size.h
      );

      ctx.strokeStyle = "green";
      ctx.strokeRect(
         this.position.x,
         this.position.y,
         this.size.w,
         this.size.h
      )

      if (this.hitboxPosition && this.hitboxSize) {
         ctx.strokeStyle = "red";
         ctx.strokeRect(
            this.hitboxPosition.x, 
            this.hitboxPosition.y, 
            this.hitboxSize.w, 
            this.hitboxSize.h
         );
      }
      
   }
}