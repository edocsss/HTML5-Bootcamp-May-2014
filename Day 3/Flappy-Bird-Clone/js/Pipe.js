function Pipe (game, stage) {
    this.game = game;
    this.stage = stage;

    this.randomCounter = ((12376186 * Math.random()) % 300) * Math.sin(Math.random()) * 100000;
    this.width = 100;
    this.height = 30 + Math.floor((this.randomCounter * Math.random())) % 200;
    
    this.x = this.game.width;
    this.y = this.game.height - this.height;
    
    this.vx = -200;
    
    this.color = 'green';
    this.active = false;
    this.rotate = false;
    
    this.gapHeight = 180;
    
    this.image = new Image;
    this.image.onload = this.imageLoaded.bind(this);
    this.image.src = 'images/small-pipe.png';
    this.loaded = false;
}

Pipe.prototype.imageLoaded = function () {
    this.loaded = true;
};

Pipe.prototype.animate = function () {
    this.active = true;
    console.log(this.active, 'testing');
};

Pipe.prototype.update = function (delta) {
    if (this.active) {
        this.x = this.x + this.vx * (delta / 1000);
    
        //When the block is out of the screen the he left
        if (this.x < -this.width) {
            this.recycle();
        }
    }
};

//To reset the initial state of the block when it has gone out of the left screen
Pipe.prototype.recycle = function () {
    this.x = this.game.width;
    this.color = 'green';
    
    //Changing the height of the pipe
    this.randomCounter = ((12376186 * Math.random()) % 300) * Math.sin(Math.random()) * 100000;
    this.height = 30 + Math.floor((this.randomCounter * Math.random())) % 200;
    this.y = this.game.height - this.height;
};

Pipe.prototype.draw = function (ctx) {
    if (this.loaded && this.active) {
        var moveX = this.x + this.width / 2;
        var moveY = this.height / 2;
        var upperPipeHeight = this.y - this.gapHeight;
        
        ctx.save();
        
        //Draw the lower pipes
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        //Setting the rotation of the upper pipes 
        ctx.translate(moveX, moveY); //Move the origin point to the center of the upper pipes
        ctx.rotate(Math.PI); //Rotate the drawing plane 180 degrees -> CAREFUL OF THE SIGN!!
        ctx.translate(this.width / 2, this.height / 2); //Move to the top left edge of the upper pipes
        
        //Make the top left edge of the upper pipe as the ORIGIN POINT (0,0) and start drawing the pipe from there
        //Since it is rotated 180 degrees, it SEEMS that the plane is also rotated -> going up is positive and going to the left is positive now!!
        //That's why the arguments drawImage below have the opposite sign compared with the usual one
        ctx.drawImage(this.image, 0, 0, -this.width, -upperPipeHeight);
        
        //This will remove the rotation and the translation settings
        ctx.restore();
    }
};