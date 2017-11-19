var Filter = function(name) {
    let content = null;
    this.name = name;
    this.id = null;

    this.apply = function(context) {
        if(content != null) {
            let img = $("<img/>", { src: content });
            img.on('load', () => {
                context.drawImage(img[0], 0, 0);
            });
        }
    };

    this.rename = function(n) {
        this.name = n;
    };

    this.getName = function() {
        return this.name;
    };

    this.getContent = function() {
        return content;
    };

    this.updateContent = function(con) {
        content = con;
    };

    this.getId = function() {
        return this.id;
    };

    this.setId = function(id) {
        this.id = id;
    };
};