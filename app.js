var canvas = document.getElementById("Game");
       var ctx = canvas.getContext("2d");
       var arrow = new Image();

       // Player's X coordnates 
       var arrowX = canvas.width/2-75;

       //Player's Y coordnates
       var arrowY = 150;

       //Variable to trigger  3 different obstacles randomly 
       var random = 0;

      var i1 = 0;
      var i2 = 0;
      var i3 = 0;
      //Obstacle's X coordnate 
      var squareX1 = canvas.width/6-50;
      var squareX2 = canvas.width/2-50;
      var squareX3 = canvas.width/6*5-50;

      //Obstacle's Y coordnate 
      var squareY1 = 910;
      var squareY2 = 910;
      var squareY3 = 910;

      //Frames per second
      var frames = 75;
    
      //Event listener to move player
     document.addEventListener("keydown", key);
     

     var check = 2;
     
     //Keys to move player
     function key(event){
       console.log(check);
      
       //Key D
       if(event.keyCode === 68 ) {
         if (check < 3) {
           check = check+1 ;
           arrowX = arrowX + 1900/3;
           }
         }
      
       //Key A
       if (event.keyCode === 65) {
         if(check > 1) {
           check = check-1;
           arrowX = arrowX - 1900/3;
         }
       }

       //Left arrow
       if(event.keyCode === 37 ) {
        if(check > 1) {
           check = check-1;
           arrowX = arrowX - 1900/3;
         }
         }

         //Right arrow
         if (event.keyCode === 39) {
          if (check < 3) {
           check = check+1 ;
           arrowX = arrowX + 1900/3;
           }
       }
     }


         
       //Function to draw squares
       function square(x,y,w,h){
         ctx.fillStyle = "MediumBlue";
         ctx.strokeStyle = "MediumBlue";
         ctx.fillRect(x,y,w,h);
       }
      
      //sets random variable
      var random = Math.floor(Math.random() * 3) + 1;
      
        function pause(){
        }
      
      //Triggers obstacles to move
      setInterval(function(){

         //Changes the random variable
         random = Math.floor(Math.random() * 3) + 1;

          if (random === 1) {
            //Triggers when random = 1
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
           //Triggers when random = 2
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
           //Triggers when random = 3
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
  
      //Changes the positions of the objects for every frame
     function frameChange(){

       var stop = setInterval(function(){

          //Clears canvas
          ctx.clearRect(0,0,canvas.width,canvas.height);

          //Draws player
          ctx.fillStyle = "Red";
          ctx.fillRect(arrowX,arrowY,150,150);

          //Draws score
          ctx.fillStyle = "white";
          ctx.font = "75px Arial";
          ctx.fillText("Score: "+score,75,100);

          //Draws obstacles 
          square(squareX1,squareY1,100,250);
          square(squareX2,squareY2,100,250);
          square(squareX3,squareY3,100,250);

          if (Math.abs(squareX1 - arrowX) < 150/2 && Math.abs(squareY1 - arrowY) < 250/2){
            clearInterval(stop);
          }
          //if (Math.abs (squareX2 - arrowX) < 150/2 && Math.abs (squareY2 - arrowY) < 150/2){
           // clearInterval(stop);
          //}
          if (Math.abs(squareX3 - arrowX) < 100/2 && Math.abs(squareY3 - arrowY) < 250/2){
            clearInterval(stop);
          }
          if (Math.abs(squareX2 - arrowX) < 100/2 && Math.abs(squareY2 - arrowY) < 250/2){
            clearInterval(stop);
        }

       },1000/frames);
     }
     
     frameChange();

    //Changes score by 1 every 0.5 seconds
     var score = 0;
     setInterval(function(){
       score += 1
     },500);