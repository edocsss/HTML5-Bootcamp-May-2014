function Bird (game, stage) {
    this.game = game;
    this.stage = stage;
    this.sprite = new Sprite('./images/birdie.png', {
        cols: 14,
        rows: 1,
        x: this.x,
        y: this.y,
        height: this.height,
        cellHeight: 183,
        width: this.width,
        cellWidth: 183,
        cellOffsetX: -60,
        cellOffsetY: -60
    });
    
    this.sprite.scaleX = 0.5;
    this.sprite.scaleY = 0.5;
    this.sprite.play(0);
    this.sprite.rotation = 0.5;
    
    this.height = 50;
    this.width = 50;
    
    this.x = 80;
    this.y = 150;
    
    this.vx = 50;
    this.vy = 0;
    
    this.terminalVelocityY = 500;
    this.gravity = 1200;
    
    this.radius = this.height / 2;
    this.color = 'yellow';
    
    //On click / on space bar pressed-> fly
    this.stage.addEventListener('click', this.flap.bind(this));
    
    //Prevent highlighting the time score board when double clicked
    this.stage.onmousedown = function (e) { e.preventDefault(); };
    
    //Allow space bar to flap the bird
    window.addEventListener('keydown', this.flap.bind(this));
}

Bird.prototype.flap = function (event) {
    var key = event.button || event.keyCode
    
    //Need to big enough to go against the downward velocity
    if (!key || key === 32) {
        if (!this.vy) {
            this.vy = -600;
        }

        else {
            this.vy -= 800;
        }
    }
    
    /* 
    //If it is clicked when vx = 0, meaning that it is still on the ground, it will re-initialize the vx = 40
    if (!this.vx) {
        this.vx = 40;
    }
    */
};


//This function only changes the direction of the bird -> NOT DRAW THE BIRD YET!!
Bird.prototype.update = function (delta) {
    //Need to change downward velocity (vy) since it is affected by the gravity -> PHYSICS!
    this.vy = this.vy + (this.gravity * (delta / 1000));
    this.y = this.y + (this.vy * (delta / 1000));
    
    //To limit the downward velocity -> if it is not limited, it will be hard to go up when clicked
    if (this.vy > this.terminalVelocityY) {
        this.vy = this.terminalVelocityY;
    }
    
    else if (this.vy < -this.terminalVelocityY) {
        this.vy = -this.terminalVelocityY;
    }
    
    //Limiting the bird from going out of the lower boundary
    if (this.y > this.game.height - this.radius) {
        this.vy = 0; //To prevent still going down
        this.y = this.game.height - this.radius;
    }
    
    //From the upper boundary
    else if (this.y < this.radius) {
        this.vy = 0;
        this.y = this.radius;
    }
    
    this.sprite.rotation = this.vy / 1000;
    
    this.sprite.x = this.x - this.radius; //Will be always constant
    this.sprite.y = this.y - this.radius;
    this.sprite.tick();
    
    //Linear velocity -> no need to update the vx first
    //this.x = this.x + this.vx * (delta / 1000);
    
};

Bird.prototype.draw = function (ctx) {
    this.sprite.draw(ctx);
};