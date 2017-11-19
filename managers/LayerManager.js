var LayerManager = new (function() {
    let layers = {};
    let idCount = 1;
    let selectedLayer = null;
    let self  = this;

    this.add = function(layer) {
        if(layer instanceof Layer) {
            layers[idCount] = layer;
            layer.setId(idCount);
            idCount++;
            EventBus.publish("layer-add", { id: idCount-1, name: layer.name });
        } else {
            throw "Not a layers object";
        }
    };

    this.update = function(id, canvas, context, width, height) {
        if(id in layers) {
            layers[id].update(canvas, context, width, height);
        } else {
            throw "Not a valid layer";
        }
    };

    this.get = function(id) {
        if(id in layers) {
            return layers[id];
        } else {
            throw "Not a valid layer";
        }
    };
    
    this.rename = function(id, name) {
        if(id in layers) {
            layers[id].rename(name);
            EventBus.publish("layer-rename", { id: id, name: name });
        } else {
            throw "Not a valid layer";
        }
    };
    
    this.delete = function(id) {
        if(id in layers) {
            delete layers[id];
            EventBus.publish("layer-deleted", { id: id });
        } else {
            throw "Not a valid layer";
        }
    };

    this.getSelected = function() {
        return selectedLayer;
    };

    this.getAllLayers = function(callback) {
        for(var key in layers) {
            callback(layers[key], key);
        }
    };

    this.setVisibility = function(id, visible) {
        if(id in layers) {
            layers[id].setVisibility(visible);
            EventBus.publish("layer-visiblity-changed", { id: id, visible: visible });
        } else {
            throw "Not a valid layer";
        }
    };

    this.setAlpha = function(id, alpha) {
        if(id in layers) {
            layers[id].setAlpha(alpha);
            EventBus.publish("layer-alpha-changed", { id: id, alpha: alpha });
        } else {
            throw "Not a valid layer";
        }
    };

    let initiaize = function() {
        EventBus.subscribe("layer-selected", (event, data) => {
            if(data.id in layers)
                selectedLayer = self.get(data.id);
            else
                selectedLayer = null;
        });
    };

    initiaize();
})(); 