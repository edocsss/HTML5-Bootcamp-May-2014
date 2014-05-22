function Score (stage, el) {
    this.stage = stage;
    this.el = el;
    
    this.timeElapsed = 0; //ms since the game start / last death
    this.counter = 0;
    
    this.prevState = 0;
    this.currentState = this.prevState;        
    this.parent = document.getElementById('point_score');
}

Score.prototype.update = function (delta) {
    this.timeElapsed += delta;
    this.el.textContent = this.timeElapsed / 1000 | 0; //Make it second
    
    if (this.currentState === 0 && this.prevState === 1) {
        this.counter++;
    }

    else if (this.currentState === -1) {
        this.counter = 0;
    }

    this.updateContent();
};

Score.prototype.reset = function () {
    this.timeElapsed = 0;
};

Score.prototype.updateContent = function () {
    this.parent.textContent = this.counter;
};