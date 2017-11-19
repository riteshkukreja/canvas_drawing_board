var getRandomNumber = function(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var getRandomColor = function() {
    return new Color(getRandomNumber(0, 255),  getRandomNumber(0, 255),  getRandomNumber(0, 255));
};

var colorLimit = 50;
for(var i = 0; i < colorLimit; i++) {
    ColorLoader.addColor(getRandomColor());
}