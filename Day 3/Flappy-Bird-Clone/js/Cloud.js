function Cloud () {
    this.stage = document.getElementById('clouds');
    this.ctx = this.stage.getContext('2d');
    
    this.x = this.stage.width;
    this.randomCounter = 123 * Math.sin(Math.random()) * 100000;
    this.y = 50 + Math.random() * this.randomCounter % 300;
    
    this.vx = -100;
    
    this.width = 170;
    this.height = 100;
    
    this.image = new Image();
    this.image.onload = this.imageLoaded.bind(this);
    this.image.src = 'images/large-cloud.png';
    this.loaded = false;
    
    this.active = false;
}

Cloud.prototype.imageLoaded = function () {
    this.loaded = true;  
};

Cloud.prototype.animate = function () {
    this.active = true;  
};

Cloud.prototype.update = function (delta) {
    if (this.active) {
        this.x += this.vx * (delta / 1000);
        
        if (this.x < -this.width) {
            this.recycle();
        }
    }
};

Cloud.prototype.recycle = function () {
    this.randomCounter = this.randomCounter * Math.sin(Math.random()) * 100000;
    this.x = this.stage.width;
    this.y = 50 + Math.random() * this.randomCounter % 300;
};

Cloud.prototype.draw = function (ctx) {
    if (this.loaded) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};