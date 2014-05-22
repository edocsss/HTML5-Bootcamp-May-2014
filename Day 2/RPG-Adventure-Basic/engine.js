function main () {
    //Variable declaratoin
    var canvas = document.getElementById('layer2');
    var ctx = canvas.getContext('2d');
    var SCREEN_WIDTH = canvas.width;
    var SCREEN_HEIGHT = canvas.height;
    
    
    //The animation function
    var sprite = new Sprite('./assets/character/guy1.png', {
        cols: 4,
        rows: 4,
        width: 32,
        height: 32,
        cellWidth: 32,
        cellHeight: 48,
        cellOffsetX: 0,
        cellOffsetY: -16
    });
    
    
    //Initialize the position of the sprite
    sprite.x = SCREEN_WIDTH / 2;
    sprite.y = SCREEN_HEIGHT / 2;
    
    
    //Recursion function that draws the sprite
    function drawFrame () {
        
        //Tells the browser to call drawFrame*() again whenever the browser has done drawing the current frame -> just like recursive or loop
        //Cannot use the usual loop -> 
        window.requestAnimationFrame(drawFrame);
        
        //Clear the entire canvas
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); 
        
        //The function draw is from the Sprite.js
        sprite.draw(ctx);
    }
    
    
    //Start the animation
    sprite.play(sprite.face);
    drawFrame();
    
    
    //Move the sprite when the keyboard is pressed
    window.addEventListener('keydown', function (event) {
        var key = event.keyCode;
        
        //Do something based on the pressed key
        switch (key) {
            //Left key
            case 37 :
                //Change the movement velocity ONLY when the key is pressed
                sprite.vx = -2 ;
                sprite.play(1);
                break;
            
            //Right key
            case 39:
                sprite.vx = 2;
                sprite.play(2);
                break;
            
            //Up key
            case 38 :
                sprite.vy = -2;
                sprite.play(3);
                break;
            
            //Down key :
            case 40 :
                sprite.vy = 2;
                sprite.play(0);
                break;
        }          
    });
    
    //Whenever the keyboard is not pushed, stop the movement of the ball by making the velocity zero
    window.addEventListener('keyup', function () {
        //Stop the sprite movement
        sprite.vx = 0;
        sprite.vy = 0;
        
        //Stop the picture from changing (between one row of picture) when the keyboard is not pressed
        sprite.stop();
    });
}

//Start the whole animation when the window is loaded
window.addEventListener("DOMContentLoaded", main);