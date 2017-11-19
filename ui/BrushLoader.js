var BrushLoader = new (function() {
    let brushes = [];
    let selectedBrush = null;
    let brushSize = 10;
    let container = null;

    let selectBrush = function(pos) {
        selectedBrush = brushes[pos];
        selectedBrush.initialize();
        updateView();
    };

    let updateView = function() {
        container.updateDetails();
        container.toggleSwatchView(false);
    };

    let drawDetailItem = function() {
        /** Selected Brush details */
        var selectedBrushDetail = document.createElement("span");
        selectedBrushDetail.classList.add("bordered");
        selectedBrushDetail.innerText = (selectedBrush ? selectedBrush.label : "select brush");
        return selectedBrushDetail;
    }

    let drawBrushGroup = function(title, list) {
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

    let drawBrushSizeGroup = function(title) {
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

    let drawSwatchItems = function() {
        var brushPalete = document.createElement("div");

        brushPalete.appendChild(drawBrushSizeGroup("Brush Size"));
        brushPalete.appendChild(drawBrushGroup("Brushes", brushes));

        return brushPalete;
    };
    
    let draw = function(position, color, context) {
        selectedBrush.draw(position, brushSize, color, context);
    };

    this.bootstrap = function(parent) {
        container = new ControlSwatch(drawDetailItem, drawSwatchItems);
        selectedBrush = brushes[0];
        container.draw(parent);

        EventBus.subscribe("draw-point", (event, data) => {
            draw(data.position, ColorLoader.getSelected(), data.context);
            EventBus.publish("draw-point-success", data.position);
        });
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