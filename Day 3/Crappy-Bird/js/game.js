function Game (stage) {
    this.stage = stage;
    this.ctx = stage.getContext('2d');
    
    this.bird = new Bird(this, this.stage);
    this.score = new Score(this.stage, document.getElementById('time_score'));
    
    this.height = this.stage.height;
    this.width = this.stage.width;
    
    this.pipes = [];
    this.drawPipes = true;
    
    //Create and let each pipe to move after an amount of time
    for (var i = 0; i < 3; i++) {
        this.pipes[i] = new Pipe(this, this.stage);
        setTimeout(function (p) {
            p.animate();
        }.bind(this, this.pipes[i]), i * 1350); //i * 200 will put the waiting in the correct queue
        //The first "this" refers to the game, so that it can be used in this.pipes[i] -> this.pipes[i] is passed so that "this" in the animate() will
        //refer to the object in the array index this.pipes[i]
        //The second argument of bind() is the argument that is passed into the function (which is going to be run in the setTimeout())
        //The first argument tells where "this" refers to, and so the second argument can use the word "this" with the new reference
    }
    
    //Array of cloud objects
    this.clouds = [];
    
    //Animating each cloud
    for (var i = 0; i < 3; i++) {
        this.clouds[i] = new Cloud();
        setTimeout(function (p) {    
            p.animate();
        }.bind(this, this.clouds[i]), i * 3000);
    }
    
    //New object to check whether the bird touches the pipes
    this.collider = new Collider(this, this.bird, this.pipes, this.score);
    
    //New object to handle saving and restoring game data
    this.storage = new Storage(this, this.bird, this.pipes, this.clouds);
    
    //Default tick
    this.lastTick = Date.now();
    
    //Start animating
    this.tick();
}

//This function keep track how many miliseconds have passed since this function is last called
//This will tell the object to how far they should MOVE their position using vx and vy just like in physics after the delta miliseconds
Game.prototype.tick = function () {
    var now = Date.now();
    var delta = now - this.lastTick;
    this.lastTick = now;
    
    //Updating the game objects
    this.bird.update(delta);
        
    //Drawing the game objects
    this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
    this.bird.draw(this.ctx);
    
    //Draw the clouds
    this.clouds[0].ctx.clearRect(0, 0, this.clouds[0].stage.width, this.clouds[0].stage.height);
    for (var i = 0; i < this.clouds.length; i++) {
        this.clouds[i].update(delta);
        this.clouds[i].draw(this.clouds[i].ctx);
    }
    
    //Drawing the pipes
    if (this.drawPipes) {
        for (var i = 0; i < this.pipes.length; i++) {
            this.pipes[i].update(delta);
            this.pipes[i].draw(this.ctx);
        }
    }
    
    //Check for any collision & update the score
    this.score.currentState = this.collider.checkCollision();
    this.score.update(delta);
    this.score.prevState = this.score.currentState;
        
    //Render the next frame when the current frame has finished
    requestAnimationFrame(this.tick.bind(this));
}

Game.prototype.die = function () {
    this.score.reset();  
};

window.addEventListener('DOMContentLoaded', function () {
    var stage = document.getElementById('stage');
    new Game(stage); 
});