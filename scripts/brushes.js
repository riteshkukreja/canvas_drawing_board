/** Brushes */
var RoundBrush = new Brush("Round Brush", null, function(position, size, color, context) {
    context.fillStyle = color;
    context.arc(position.x, position.y, size, 0, 2*Math.PI);
    context.fill();
});

var SquareBrush = new Brush("Square Brush", null, function(position, size, color, context) {
    context.fillStyle = color;
    context.translate(position.x + size/2, position.y + size/2);
    context.rotate(getCursorAngle(position) * Math.PI/180);
    context.rect(-size/2, -size/2, size, size);
    context.fill();
});

var ClearBrush = new Brush("Clear Brush", function(context) {
        context.globalCompositeOperation = 'destination-out';
    }, function(position, size, color, context) {
        context.arc(position.x, position.y, size, 0, 2*Math.PI);
        context.fill();
});

BrushLoader.addBrush(RoundBrush);
BrushLoader.addBrush(SquareBrush);
BrushLoader.addBrush(ClearBrush);