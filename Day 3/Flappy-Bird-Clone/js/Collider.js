function Collider (game, bird, pipes) {
    this.game = game;
    this.bird = bird;
    this.pipes = pipes;
    
    this.leftX = this.bird.x - this.bird.width / 2;
    this.rightX = this.bird.x + this.bird.width / 2;
}

Collider.prototype.checkCollision = function () {
    var ret = 0;
    for (var i = 0; i < this.pipes.length; i++) {
        var pipe = this.pipes[i];
        var pipeRightX = pipe.x + pipe.width;
        
        //Create two variables to determine where the "real" edge of the bird -> bird.y is not the edge -> the position of the center point of the arc
        var bottomBird = this.bird.y + this.bird.radius;
        var topBird = this.bird.y - this.bird.radius;
        
        //If the edge of the rectangle between the edge of the ball (or inside the ball) -> COLLIDE!
        //Three condition for the x-axis
        //If the left of the pipe inside the ball, if the right of the pipe inside the ball, and 
        //IF THE LEFT EDGE OF THE BALL IS STILL INSIDE THE PIPE
        //The conditional statement inside is to check the Y-axis collision condition
        if ( ((pipe.x > this.leftX && pipe.x < this.rightX) || 
              (pipeRightX > this.leftX && pipeRightX < this.rightX) || 
              (this.leftX > pipe.x && this.leftX < pipeRightX)) ) {
             
            if ((bottomBird > pipe.y) || (topBird < pipe.y - pipe.gapHeight)) {               
                pipe.color = 'red';
                this.game.die();
                ret = -1;
            } 
            
            //If the ball is between the pipes
            else {
                ret = 1;
            }
        }
    
        else {
            pipe.color = 'green';
        }
    }
    
    return ret;
};