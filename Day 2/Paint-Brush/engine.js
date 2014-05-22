window.addEventListener("DOMContentLoaded", function () {
    var down = false;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', drawCoords);
    
    ctx.fillStyle = "#fff";
    
    function mouseDown () {
        down = true;
    }
    
    function mouseUp () {
        down = false;
    }
    
    function drawCoords (evt) {
        if (down) {
            var rect = canvas.getBoundingClientRect();
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            
            ctx.moveTo(x, y);
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
})