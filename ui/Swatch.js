var Swatch = function(drawDetailItem) {
    this.holder = null;
    this.detailsHolder = null;

    this.drawDetailItem = drawDetailItem;

    this.updateDetails = function() {
        this.detailsHolder.innerHTML = "";

        /** Selected Brush details */
        var selectedDetail = this.drawDetailItem();
        this.detailsHolder.appendChild(selectedDetail);
    };

    this.detailView = function() {
        var DetailsHolder = document.createElement("div");
        this.detailsHolder = DetailsHolder;
        this.updateDetails();
    };

    this.draw = function(parent) {
        this.detailView();

        /** Show selected brush and dropdown option */
        parent.appendChild(this.detailsHolder);
    };
};