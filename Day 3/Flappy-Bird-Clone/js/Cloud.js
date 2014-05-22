function Cloud () {
    this.stage = document.getElementById('clouds');
    this.ctx = this.stage.getContext('2d');
    
    this.x = 700;
    this.y = 100;
    
    this.vx = -100;
    this.vy = 1;
    
    this.width = 170;
    this.height = 100;
    
    this.image = new Image();
    this.image.onload = this.imageLoaded.bind(this);
    this.image.src = 'images/large-cloud.png';
    this.loaded = false;
}

Cloud.prototype.imageLoaded = function () {
    this.loaded = true;  
};

Cloud.prototype.update = function (delta) {
    this.x += this.vx * (delta / 1000);
    this.y += this.vy * (delta / 1000);
};

Cloud.prototype.draw = function (ctx) {
    if (this.loaded) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};