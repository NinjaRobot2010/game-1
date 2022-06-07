var canvas = document.getElementById("Game");
       var ctx = canvas.getContext("2d");
       var arrow = new Image();
       var arrowX = canvas.width/2-75;
       var arrowY = 150;
       var random = 0;

      var i1 = 0;
      var i2 = 0;
      var i3 = 0;

      var squareX1 = canvas.width/6-50;
      var squareX2 = canvas.width/2-50;
      var squareX3 = canvas.width/6*5-50;

      var squareY1 = 910;
      var squareY2 = 910;
      var squareY3 = 910;
    
     document.addEventListener("keydown", key);

     var check = 2;

     function key(event){
       console.log(check);

       if(event.keyCode === 68 ) {
         if (check < 3) {
           check = check+1 ;
           arrowX = arrowX + 1900/3;
           }
         }

       if (event.keyCode === 65) {
         if(check > 1) {
           check = check-1;
           arrowX = arrowX - 1900/3;
         }
       }

       if(event.keyCode === 37 ) {
        if(check > 1) {
           check = check-1;
           arrowX = arrowX - 1900/3;
         }
         }

         if (event.keyCode === 39) {
          if (check < 3) {
           check = check+1 ;
           arrowX = arrowX + 1900/3;
           }
       }
     }


         

       function square(x,y,w,h){
         ctx.fillStyle = "MediumBlue";
         ctx.strokeStyle = "MediumBlue";
         ctx.fillRect(x,y,w,h);
       }
      
      var random = Math.floor(Math.random() * 3) + 1;
      
        function pause(){
        }

      setInterval(function(){
         random = Math.floor(Math.random() * 3) + 1;
          if (random === 1) {
            squareY1 = 910;
            
            i1 = 0;
              var interval1 = setInterval(function(){
                if(i1 < 30){
              squareY1 = squareY1 - canvas.height/18;
              i1++;
                }else{
                  clearInterval(interval1);
                }
               },30);


        }
         if (random === 2) {
          squareY2 = 910;
              i2 = 0;
              var interval2 = setInterval(function(){
                if(i2 < 30){
              squareY2 = squareY2 - canvas.height/18;
              i2++;
                }else{
                  clearInterval(interval2);
                }
               },30);

             squareY2 = 910;
         }
         if (random === 3) {
          squareY3 = 910;
          i3 = 0;
              var interval3 = setInterval(function(){
                if(i3 < 30){
              squareY3 = squareY3 - canvas.height/18;
              i3++;
                }else{
                  clearInterval(interval3);
                }
               },30);

         }
          console.log(random);
          console.log(squareY1);
      },1000);
  
     function frameChange(){
       var stop = setInterval(function(){
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle = "Red";
          ctx.fillRect(arrowX,arrowY,150,150);
          ctx.fillStyle = "white";
          ctx.font = "75px Arial";
          ctx.fillText("Score: "+score,75,100);
          square(squareX1,squareY1,100,250);
          square(squareX2,squareY2,100,250);
          square(squareX3,squareY3,100,250);

          if (Math.abs(squareX1 - arrowX) < 150/2 && Math.abs(squareY1 - arrowY) < 250/2){
            clearInterval(stop);
          }
          //if (Math.abs (squareX2 - arrowX) < 150/2 && Math.abs (squareY2 - arrowY) < 150/2){
           // clearInterval(stop);
          //}
          if (Math.abs(squareX3 - arrowX) < 150/2 && Math.abs(squareY3 - arrowY) < 250/2){
            clearInterval(stop);
          }
          if (Math.abs(squareX2 - arrowX) < 150/2 && Math.abs(squareY2 - arrowY) < 250/2){
            clearInterval(stop);
        }

       },1000/100);
     }
     
     frameChange();

     var score = 0;
     setInterval(function(){
       score += 1
     },500);