var Brush = function(label, setupCallback, drawCallback) {
    this.label = label || "sample brush";
    lastPosition = null;

    this.initialize = function() {
        lastPosition = null;
    };

    var setup = setupCallback || function() {
        context.globalCompositeOperation = 'source-over';
    };

    this.draw = function(position, size, color, context) {
        setup();

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

var BrushLoader = new (function() {
    var brushes = [];
    var selectedBrush = null;
    var brushSize = 10;
    var container = null;

    var selectBrush = function(pos) {
        selectedBrush = brushes[pos];
        selectedBrush.initialize();
        updateView();
    };

    this.draw = function(position, color, context) {
        selectedBrush.draw(position, brushSize, color, context);
    };

    var updateView = function() {
        container.updateDetails();
        container.toggleSwatchView(false);
    };

    var drawDetailItem = function() {
        /** Selected Brush details */
        var selectedBrushDetail = document.createElement("span");
        selectedBrushDetail.classList.add("bordered");
        selectedBrushDetail.innerText = (selectedBrush ? selectedBrush.label : "select brush");
        return selectedBrushDetail;
    }

    var drawBrushGroup = function(title, list) {
        var brushGroup = document.createElement("div");
        brushGroup.classList.add("swatch-group");

        var titleSpan = document.createElement("span");
        titleSpan.classList.add("group-title");
        titleSpan.innerText = title;

        var brushPalete = document.createElement("div");
        for(var i = 0, n = list.length; i < n ; i++) {
            var b = document.createElement("span");
            b.classList.add("brush");
            b.innerText = brushes[i].label;
            b.setAttribute("data", i);
            b.addEventListener("click", function(ev) {
                var pos = ev.target.getAttribute("data");
                selectBrush(pos);
            });

            brushPalete.appendChild(b);
        }

        brushGroup.appendChild(titleSpan);
        brushGroup.appendChild(brushPalete);

        return brushGroup;
    }; 

    var drawBrushSizeGroup = function(title) {
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
        sizeSlider.setAttribute("value", brushSize);

        sizeSlider.addEventListener("input", function(e) {
            brushSize = e.srcElement.value;
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
        var brushPalete = document.createElement("div");

        brushPalete.appendChild(drawBrushSizeGroup("Brush Size"));
        brushPalete.appendChild(drawBrushGroup("Brushes", brushes));

        return brushPalete;
    };

    this.bootstrap = function(parent) {
        container = new ControlSwatch(drawDetailItem, drawSwatchItems);
        selectedBrush = brushes[0];
        container.draw(parent);
    };

    this.getSelected = function() {
        return selectedBrush;
    };

    this.addBrush = function(brush) {
        brushes.push(brush);
        
        /** If visible */
        if(container)
            container.updateSwatches();
    };
})();

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

var ClearBrush = new Brush("Clear Brush", function() {
        context.globalCompositeOperation = 'destination-out';
    }, function(position, size, color, context) {
        context.arc(position.x, position.y, size, 0, 2*Math.PI);
        context.fill();
});

BrushLoader.addBrush(RoundBrush);
BrushLoader.addBrush(SquareBrush);
BrushLoader.addBrush(ClearBrush);