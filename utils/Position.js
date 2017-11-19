var Position = function(x, y) {
    this.x = x;
    this.y = y;

    this.distance = function(pos) {
        return Math.sqrt(Math.pow(this.x - pos.x, 2), Math.pow(this.y - pos.y, 2));
    };

    this.angle = function(pos) {
        return Math.atan2(pos.y - this.y, pos.x - this.x);
    };
};