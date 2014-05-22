//Creating a new object SPRITE
function Sprite (imageURL, options) {
    //Parsing options
    if (!options)
        options = {};
    
    this.x = 0;
    this.y = 0;
    this.width = options.width || 0;        //Boolean operator -> pass the width if the width in options is found
    this.height = options.height || 0;
    this.rows = options.rows || 0;
    this.cols = options.cols || 0;
    this.vx = 0;
    this.vy = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.face = 0; //Initialize where the sprite faces at first
    
    //Using underscore = private class property
    this._image = null;
    this.imageLoaded = false;
    this.setImage(imageURL);
    
    this.cellWidth = options.cellWidth || this.width;
    this.cellHeight = options.cellHeight || this.height;
    this.cellOffsetX = options.cellOffsetX || 0;
    this.cellOffsetY = options.cellOffsetY || 0;
    
    //Tells where to grab a particular image from inside the .png file
    this._spritesheetOffsetX = 0;
    this._spritesheetOffsetY = 0;
    
    //Setting the timeline
    this.isPlaying = false;
    this.counter = 0;                               //Updated every frame a sequence is played
    this.sampleRate = 5;                            //Amount of ticks to play each cell
    this.sampleChange = this.sampleRate;            //Next change point on timeline that causes a sample transition
    this.sampleEnd = this.sampleRate * this.cols;   //End of the timeline
}


//Creating the initial image
Sprite.prototype.setImage = function (imgURL) {
    console.log("Sprite.prototype.setImage()");
    this._image = new Image();
    
    //Use bind to define to whom "this" refers to inside the function
    this._image.onload = (function () {
        //If we do not use .bind(this), this will refer to "this._image" since we call this function from the event "this._image.onload"
        //Since we use BIND, "this" will refer back to Sprite
        this.imageLoaded = true;
        this.width = this._image.width;
        this.height = this._image.height;
    
    }).bind(this);
    
    //Tell where the image is
    this._image.src = imgURL;
};


//Drawing the sprite
Sprite.prototype.draw = function (ctx) {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.imageLoaded) {
    
        //Save the current transformation and previous setting first
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, this.scaleY);
        
        //Update
        if (this.isPlaying)
            this.tick();
        
        //Literally draw / put the sprite image on the canvas
        //See MDN drawImage() documentation to understand the 9 arguments
        ctx.drawImage(this._image, 
                      
                      //This four arguments control the sizing INSIDE THE IMAGE -> RELATIVE to THE IMAGE ITSELF
                      this._spritesheetOffsetX, 
                      this._spritesheetOffsetY, 
                      this.cellWidth, 
                      this.cellHeight,
                      
                      //This four arguments control the layout of the image INSIDE THE CANVAS -> RELATIVE to THE CANVAS
                      this.cellOffsetX,
                      this.cellOffsetY,
                      this.cellWidth,
                      this.cellHeight
                     );
    
        //Re calling the last saved setting
        ctx.restore();
    }
};


//To start playing the animation -> defined that the row is 0 at first
Sprite.prototype.play = function (row) {
    this._spritesheetOffsetY = row * this.cellHeight;
    this.isPlaying = true;
};


//Handle when the animation stops -> when keyup -> reset counter and stop animation
Sprite.prototype.stop = function () { 
    this.isPlaying = false;
    this.resetCounter();
};


//Updating the tick
//Monitoring the sample rate
Sprite.prototype.tick = function () {
    //When the counter has reached the end, it will reset
    if (this.counter === this.sampleEnd)
        this.resetCounter();
    
    //When the counter has reached the maximum, it moves to the next sprite by changing the offsetX
    else if (this.counter === this.sampleChange) {
        this._spritesheetOffsetX += this.cellWidth;
        this.sampleChange += this.sampleRate; //Add another sampleRate to sampleChange -> to check for the next picture
    }
    
    this.counter += 1;
};


//Reset this.counter and this._spritesheetOffsetX
Sprite.prototype.resetCounter = function () {
    this.counter = 0;
    this._spritesheetOffsetX = 0;
    this.sampleChange = this.sampleRate;
};