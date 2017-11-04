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

var ColorLoader = new (function() {
    var colors = [];
    var history = [];

    var selectedColor = null;
    var container = null;

    var setColor = function(color) {
        var nextColor = color.clone();
        nextColor.a = selectedColor.a;
        selectedColor  = nextColor;
    };

    var insertIntoHistory = function(color) {
        for(var i = history.length-1; i >= 0; i--) {
            if(history[i] == color) {
                history.splice(i, 1);
            }
        }

        history.unshift(color);
    };

    var drawColorItem = function(pos, color) {
        var swatch = document.createElement('span');
        swatch.classList.add("color");
        swatch.style.backgroundColor = color;
        swatch.setAttribute("data-pos", pos);
        swatch.setAttribute("data-type", "all");
        swatch.addEventListener("click", setSwatch);
        return swatch;
    };

    var drawHistoryItem = function(pos, color) {
        var swatch = document.createElement('span');
        swatch.classList.add("color");
        swatch.style.backgroundColor = color;
        swatch.setAttribute("data-pos", pos);
        swatch.setAttribute("data-type", "history");
        swatch.addEventListener("click", setSwatch);
        return swatch;
    };

    var drawColorGroup = function(title, list, itemDraw) {
        var colorGroup = document.createElement("div");
        colorGroup.classList.add("color-group");

        var titleSpan = document.createElement("span");
        titleSpan.classList.add("group-title");
        titleSpan.innerText = title;

        var colorPalete = document.createElement("div");
        for(var i = 0, n = list.length; i < n ; i++) {
            colorPalete.appendChild(itemDraw(i, list[i]));
        }

        colorGroup.appendChild(titleSpan);
        colorGroup.appendChild(colorPalete);

        return colorGroup;
    };

    var drawAlphaGroup = function(title) {
        var brushGroup = document.createElement("div");
        brushGroup.classList.add("swatch-group");

        var titleSpan = document.createElement("span");
        titleSpan.classList.add("group-title");
        titleSpan.innerText = title;

        /** Brush Size content */
        var brushPalete = document.createElement("div");

        /** Brush minimum size icon */
        var sizeSliderMinInfo = document.createElement("span");
        sizeSliderMinInfo.classList.add("slider-min");
        sizeSliderMinInfo.innerText = 1;

        /** Brush Size slider */
        var sizeSlider = document.createElement("input");
        sizeSlider.type = "range";
        sizeSlider.setAttribute("min", 1);
        sizeSlider.setAttribute("max", 100);
        sizeSlider.setAttribute("step", 1);
        sizeSlider.setAttribute("value", selectedColor.a);

        sizeSlider.addEventListener("input", function(e) {
            selectedColor.a = e.srcElement.value;
        });

        /** Brush maximum size icon */
        var sizeSliderMaxInfo = document.createElement("span");
        sizeSliderMaxInfo.classList.add("slider-max");
        sizeSliderMaxInfo.innerText = 100;
        
        brushPalete.appendChild(sizeSliderMinInfo);
        brushPalete.appendChild(sizeSlider);
        brushPalete.appendChild(sizeSliderMaxInfo);

        brushGroup.appendChild(titleSpan);
        brushGroup.appendChild(brushPalete);

        return brushGroup;
    }; 

    var drawSwatchItems = function() {
        var colorPalete = document.createElement("div");

        colorPalete.appendChild(drawAlphaGroup("Opacity"));

        if(history.length > 0)
            colorPalete.appendChild(drawColorGroup("Frequently Used", history, drawHistoryItem));
        
        colorPalete.appendChild(drawColorGroup("All", colors, drawColorItem));

        return colorPalete;
    };

    var drawDetailItem = function() {
        var selectedDetail = document.createElement("i");
        selectedDetail.classList.add("color");
        selectedDetail.classList.add("active");
        selectedDetail.classList.add("small");
        selectedDetail.style.backgroundColor = selectedColor;

        return selectedDetail;
    };

    var setSwatch = function(e) {
        var swatch = e.target;

        if(swatch) {
            var pos = swatch.getAttribute("data-pos");
            var type = swatch.getAttribute("data-type");

            if(type == "history") {
                setColor(history[pos]);
                insertIntoHistory(history[pos]);
            } else {
                setColor(colors[pos]);
                insertIntoHistory(colors[pos]);
            }
            
            container.updateDetails();
            container.updateSwatches();
            container.toggleSwatchView(false);
        }
    };

    this.bootstrap = function(parent) {
        container = new ControlSwatch(drawDetailItem, drawSwatchItems);
        selectedColor = colors[0];
        container.draw(parent);
    };

    this.getSelected = function() {
        return selectedColor;
    };

    this.addColor = function(color) {
        colors.push(color);
        
        /** If visible */
        if(container)
            container.updateSwatches();
    } 
})();

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