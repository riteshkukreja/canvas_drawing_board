var Layer = function(title) {
    let content = null;
    let image = null;
    let imageSrc = null;
    this.name = title;
    this.visibility = true;
    this.alpha = 1;
    this.id = null;

    this.update = function(canvas, context, width, height) {
        content = context.getImageData(0, 0, width, height);
        imageSrc = canvas.toDataURL('image/png');
        image = $("<img/>", { src: imageSrc })[0];
    };

    this.get = function() {
        return content;
    };

    this.rename = function(name) {
        this.name = name;
    };

    this.setVisibility = function(visible) {
        this.visibility = visible;
    };

    this.apply = function(context, noAlpha) {
        if(image != null) {
            /** super slow */
            // for(let i = 0; i < content.data.length; i += 4) {
            //     content.data[i+3] = Math.floor(255 * this.alpha);
            // }
            // context.putImageData(content, 0, 0);

            /** Relatively fast */
            
            //let img = $("<img/>", { src: image });
            if(!noAlpha)
                context.globalAlpha = this.alpha;
            context.drawImage(image, 0, 0);
            context.globalAlpha = 1;
        }
    };

    this.applyDrawing = function(context, width, height) {
        if(image != null) {
            let alpha = this.alpha;
            image.addEventListener('load', () => {
                context.clearRect(0, 0, width, height);

                context.globalAlpha = alpha;
                context.drawImage(image, 0, 0);
                context.globalAlpha = 1;
            });
        }
    };

    this.getImageSrc = function() {
        return imageSrc;
    };

    this.setAlpha = function(al) {
        this.alpha = al;
    };

    this.setId = function(id) {
        this.id = id;
    };

    this.getId = function() {
        return this.id;
    };
};