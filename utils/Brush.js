var Brush = function(label, setupCallback, drawCallback) {
    this.label = label || "sample brush";
    lastPosition = null;

    this.initialize = function() {
        lastPosition = null;
    };

    var setup = setupCallback || function(context) {
        context.globalCompositeOperation = 'source-over';
    };

    this.draw = function(position, size, color, context) {
        setup(context);

        context.lineWidth = 2 * size;
        context.lineTo(position.x, position.y);
        context.strokeStyle = color;
        context.stroke();
        context.beginPath();
            
        context.save();
        drawCallback(position, size, color, context);
        context.restore();

        context.closePath();

        context.beginPath();
        context.moveTo(position.x, position.y);

        lastPosition = position;
    };

    getCursorAngle = function(position) {
        if(lastPosition == null) return 0;

        return lastPosition.angle(position);
    };  
};