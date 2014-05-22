function Game (stage) {
    this.stage = stage;
    this.ctx = stage.getContext('2d');
    
    this.bird = new Bird(this, this.stage);
    this.score = new Score(this.stage, document.getElementById('time_score'));
    
    this.height = this.stage.height;
    this.width = this.stage.width;
    
    this.pipes = [];
    
    //Create and let each pipe to move after an amount of time
    for (var i = 0; i < 3; i++) {
        this.pipes[i] = new Pipe(this, this.stage);
        
        //Run the function after 200ms
        setTimeout(function (p) {
            p.animate();
        }.bind(this, this.pipes[i]), i * 1350); //i * 200 will put the waiting in the correct queue
        //The first "this" refers to the game, so that it can be used in this.pipes[i] -> this.pipes[i] is passed so that "this" in the animate() will
        //refer to the object in the array index this.pipes[i]
    }
    
    this.collider = new Collider(this, this.bird, this.pipes, this.score);
    this.cloud = new Cloud(this.game, this.stage);
    this.lastTick = Date.now();
    this.tick();
}

Game.prototype.tick = function () {
    var now = Date.now();
    var delta = now - this.lastTick;
    this.lastTick = now;
    
    //Updating the game objects
    this.bird.update(delta);
    
    //Updating the cloud picture
    this.cloud.update(delta);
    
    //Drawing the game objects
    this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
    this.bird.draw(this.ctx);
    
    //Draw the clouds
    this.cloud.ctx.clearRect(0, 0, this.cloud.stage.width, this.cloud.stage.height);
    this.cloud.draw(this.cloud.ctx);
    
    //Drawing the pipes
    for (var i = 0; i < this.pipes.length; i++) {
        this.pipes[i].update(delta);
        this.pipes[i].draw(this.ctx);
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