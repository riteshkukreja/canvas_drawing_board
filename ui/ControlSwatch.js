var ControlSwatch = function(drawDetailItem, drawSwatchItems) {
    this.holder = null;
    this.swatchHolder = null;
    this.detailsHolder = null;

    this.drawDetailItem = drawDetailItem;
    this.drawSwatchItems = drawSwatchItems;

    this.toggleSwatchView = function(show) {
        if(typeof show == "undefined") {
            if(this.swatchHolder.classList.contains("hide"))
                this.swatchHolder.classList.remove("hide");
            else
                this.swatchHolder.classList.add("hide");
        } else if(show) {
            this.swatchHolder.classList.remove("hide");
        } else {
            this.swatchHolder.classList.add("hide");
        }
    };

    this.updateDetails = function() {
        this.detailsHolder.innerHTML = "";

        /** Selected Brush details */
        var selectedDetail = this.drawDetailItem();
        this.detailsHolder.appendChild(selectedDetail);
    };

    this.updateSwatches = function() {
        this.swatchHolder.innerHTML = "";

        /** Selected Brush details */
        var selectedDetail = this.drawSwatchItems();
        this.swatchHolder.appendChild(selectedDetail);
    };

    this.detailView = function() {
        var DetailsHolder = document.createElement("div");
        DetailsHolder.classList.add("cover");
       
        var self = this;
        DetailsHolder.addEventListener("click", function(e) {
            self.toggleSwatchView();
        });

        this.detailsHolder = DetailsHolder;
        this.updateDetails();
    };

    this.swatchView = function() {
        var swatchHolder = document.createElement("div");
        swatchHolder.classList.add("swatches");
        swatchHolder.classList.add("hide");

        swatchHolder.appendChild(this.drawSwatchItems());

        this.swatchHolder = swatchHolder;
    };

    this.draw = function(parent) {
        this.holder = document.createElement("div");
        this.holder.classList.add("swatch-container");

        this.detailView();
        this.swatchView();

        /** Show selected brush and dropdown option */
        this.holder.appendChild(this.detailsHolder);

        /** Show all brushes */
        this.holder.appendChild(this.swatchHolder);

        parent.appendChild(this.holder);
    };
};