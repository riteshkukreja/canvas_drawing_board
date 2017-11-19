var Color = function(r,g,b,a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a || 100;

    this.toString = function() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + (this.a/100) + ")";
    };

    this.clone = function() {
        return new Color(this.r, this.g, this.b, this.a);
    };
};