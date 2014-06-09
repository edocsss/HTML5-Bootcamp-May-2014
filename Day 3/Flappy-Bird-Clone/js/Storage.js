function Storage (game, bird, pipes, clouds) {
    this.game = game;
    this.bird = bird;
    this.pipes = pipes;
    this.clouds = clouds;
    
    this.saveButton = document.getElementById('save');
    this.loadButton = document.getElementById('load');
    
    this.saveButton.addEventListener('click', this.save.bind(this));
    this.loadButton.addEventListener('click', this.restore.bind(this));
}


//Save the properties of pipes as JSON string to the browser's LocalStorage if it is possible
//No need to save the bird and clouds -> pointless
Storage.prototype.save = function () {
    try {
        var data = {
            'timeScore': this.game.score.timeElapsed,
            'pointScore': this.game.score.counter
        };
        
        var dataStr = JSON.stringify(data);
        window.localStorage.setItem('savedFlappy', dataStr);
        document.getElementById('message').textContent = "Game saved!";
        
    } catch (e) {
        console.log(e);
        document.getElementById('message').textContent = "Unable to save game! Try again!";
    }
};


//Restore the data if the load button is pressed
Storage.prototype.restore = function () {
    try {
        var restoredDataStr = window.localStorage.getItem('savedFlappy');
        document.getElementById('message').textContent = "Game restored!";
    } catch (e) {
        console.log("Your browser does not support localStorage!");
        return;
    }
    
    //Check whether there is a saved data
    if (!restoredDataStr) {
        //Stop drawing the pipes and clear the canvas -> this will only remove the pipes as in the next tick, the bird and the clouds will be redrawn
        this.game.drawPipes = false;
        this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
        
        //Resetting the objects and scores
        this.game.score.reset();
        this.game.score.counter = 0;
        this.defaultPipes(this.pipes);
    }
    
    //If there is, it will change the scores into what have been saved
    else {
        var restoredData = JSON.parse(restoredDataStr);
        
        //setPositionPipes(this.pipes, restoredData.pipesData);
        this.game.score.counter = restoredData.pointScore;
        this.game.score.timeElapsed = restoredData.timeScore;
    }
};


//Draw the pipes again after 1 second clearing the canvas in a newly randomized y-axis
Storage.prototype.defaultPipes = function (pipes) {
    
    //Resetting each pipes properties
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].x = this.game.width;
        pipes[i].height = 30 + Math.floor((pipes[i].randomCounter * Math.random())) % 200;
        pipes[i].y = pipes[i].game.height - pipes[i].height;
        pipes[i].active = false;
        pipes[i].rotate = false;
    }
    
    //Reactivate the pipes after 1 second and i * 1350 ms for pipes[i]
    setTimeout(function () {
        for (var i = 0; i < pipes.length; i++) {
            this.doSetTimeout(pipes, i);
        }
        
        //Only start redrawing to the canvas after the pipes have been reactivated
        this.game.drawPipes = true;
    }.bind(this), 1000);
    
};


//A function just to help passing argument 'i' in a setTimeout function inside a loop -> which is troublesome if you don't create this function
Storage.prototype.doSetTimeout = function (pipes, i) {
    setTimeout(function () {
        pipes[i].active = true;
    }, i * 1350);  
};