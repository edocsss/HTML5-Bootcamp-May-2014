var TABLE_Y = window.innerHeight - 100;

function Ball(stage, x, y) {
    this.stage = stage;
    this.el = document.createElement('div');
    this.el.classList.add('ball');
    this.stage.appendChild(this.el);
    this.x = x;
    this.y = y;
    
    this.vx = 300; //this is pixels per second
    this.vy = 0;
    this.gravity = 500;
}

Ball.prototype.update = function (delta) {
    this.x = this.x + (this.vx * (delta / 1000)); //Change delta into second
    this.el.style.left = this.x + 'px';
    
    this.vy = this.vy + (this.gravity * (delta / 1000));
    this.y = this.y + (this.vy * (delta / 1000));
    
    if (this.y > TABLE_Y) {
        this.y = TABLE_Y;
        this.vy = -(this.vy / 1.5);
    }
    
    this.el.style.top = this.y + 'px';
}

function Game(stage) {
    this.stage = stage;
    this.ball = new Ball(this.stage, 10, 10);
    this.lastTick = Date.now();
    this.tick();
}

Game.prototype.tick = function() {
    var now = Date.now();
    
    //Time between the last update and now -> to know the time needed for the JS to calculate before drawing the actual position of the ball
    //The "delta" is used in the ball.update to specify where the ball should be RIGHT NOW -> velocity * (delta t)
    var delta = now - this.lastTick; 
    this.lastTick = now;
    this.ball.update(delta);
    requestAnimationFrame(this.tick.bind(this));
}

window.addEventListener('DOMContentLoaded', function() {
    new Game(document.getElementById('stage'));
});
