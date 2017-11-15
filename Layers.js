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

var LayersPanel = (function() {
    let panel = LayerFilterPanel;
    let layersDom = {};

    let layerDomHolder = null;
    let layerHolder = null;
    let selectedLayer = null;

    let initiaize = function() {
        layerDomHolder = panel.addSubPanel("Layers");

        EventBus.subscribe("layer-add", function(event, data) {
            addLayerAtStart(data.id, data.name);
        });

        EventBus.subscribe("layer-rename", function(event, data) {
            renameLayer(data.id, data.name);
        });
        
        EventBus.subscribe("layer-selected", function(event, data) {
            if(data.id) {
                selectLayer(data.id);
                EventBus.publish("layer-alpha-reset");
            }
        });

        EventBus.subscribe("layer-deleted", function(event, data) {
            deleteLayer(data.id);
        });

        addTopControls();
        addLayersHolder();
    };

    let addLayersHolder = function() {
        layerHolder = $("<div/>");

        layerDomHolder.append(layerHolder);
    };

    let addTopControls = function() {
        let controlHolder = $("<div/>", { class: 'controls' });

        let addLayerControl = $("<i/>", { class: 'addIcon' });
        addLayerControl.click(e => {
            LayerManager.add(new Layer("Untitled Layer"));
        });

        let addFilterControl = $("<i/>", { class: 'recordIcon' });
        addFilterControl.click(e => {
            // TODO create filter
            EventBus.publish('add-filter', LayerManager.getSelected());
        });

        let deleteControl = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete layer
            LayerManager.delete(LayerManager.getSelected().getId());
        });
        
        controlHolder.append(addLayerControl);
        controlHolder.append(addFilterControl);
        controlHolder.append(deleteControl);

        layerDomHolder.append(controlHolder);
        layerDomHolder.append(addLayerAlphaControl());
    };
    
    let addLayerControls = function() {
        let controlHolder = $("<div/>", { class: 'controls' });
        
        let renameLayerControl = $("<i/>", { class: 'renameIcon' });
        renameLayerControl.click(e => {
            onRenameHandler($(e.target).parent().parent());
        });

        let visibilityControl = $("<i/>", { class: 'visibilityIcon', 'data-visible': true });
        visibilityControl.click(e => {
            let id = $(e.target).parent().parent().data('id');
            LayerManager.setVisibility(id, !LayerManager.get(id).visibility);
            visibilityControl.attr('data-visible', LayerManager.get(id).visibility);
        });

        controlHolder.append(renameLayerControl);
        controlHolder.append(visibilityControl);

        return controlHolder;
    };

    let addLayerAlphaControl = function() {
        var layerAlphaGroup = $("<div/>", { class: 'swatch-group' });

        /** Layer minimum alpha icon */
        var alphaSliderMinInfo = $("<span/>", { class: 'slider-min', text: '0' });

        /** Layer Size slider */
        var alphaSlider = $("<input/>", {
            type: 'range',
            min: 0,
            max: 1,
            step: 0.01,
            value: 1
        });

        alphaSlider.on("input", function(e) {
            LayerManager.setAlpha(LayerManager.getSelected().getId(), alphaSlider.val());
        });

        EventBus.subscribe("layer-alpha-reset", (event, data) => {
            alphaSlider.val(LayerManager.getSelected().alpha); 
        });

        /** Layer maximum alpha icon */
        var alphaSliderMaxInfo = $("<span/>", { class: 'slider-max', text: '100' });
        
        layerAlphaGroup.append(alphaSliderMinInfo);
        layerAlphaGroup.append(alphaSlider);
        layerAlphaGroup.append(alphaSliderMaxInfo);

        return layerAlphaGroup;
    };  

    let onRenameHandler = function(parent) {
        let id = parent.data('id');
        let name = parent.children().first().text();

        let nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
        nameInput.on('blur', e => {
            LayerManager.rename(id, nameInput.val());

            nameInput.remove();
            parent.children().first().removeClass("hidden");
        });

        nameInput.on('keyup', e => {
            let code = e.keyCode || e.charCode || e.which;
            if(code == 13) {
                LayerManager.rename(id, nameInput.val());
                
                nameInput.remove();
                parent.children().first().removeClass("hidden");
            }
        });
        
        parent.append(nameInput);
        parent.children().first().addClass("hidden");

        nameInput.focus();
    };

    let addLayerAtEnd = function(id, name) {
        let layer = $("<div/>", { 'data-id': id, class: 'layer' });
        let layerTitle = $("<span/>", { html: name });

        layerTitle.click(e => {
            EventBus.publish("layer-selected", { id: id });
        });

        layerTitle.dblclick(e => {
            onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(addLayerControls());

        layerHolder.append(layer);
        layersDom[id] = layer;
        
        EventBus.publish("layer-added", { id: id });
        EventBus.publish("layer-selected", { id: id });
    };
    
    let addLayerAtStart = function(id, name) {
        let layer = $("<div/>", { 'data-id': id, class: 'layer' });
        let layerTitle = $("<span/>", { html: name });

        layerTitle.click(e => {
            if(selectedLayer != layer)
                EventBus.publish("layer-selected", { id: id });
        });

        layerTitle.dblclick(e => {
            onRenameHandler($(e.target).parent());
        });

        layer.append(layerTitle);
        layer.append(addLayerControls());

        layerHolder.prepend(layer);
        layersDom[id] = layer;
        
        EventBus.publish("layer-added", { id: id });
        EventBus.publish("layer-selected", { id: id });
    };

    let renameLayer = function(id, name) {
        if(typeof layersDom[id] != undefined) {
            let selectedLayer = layersDom[id];
            selectedLayer.children().first().text(name);
        } else {
            throw "Layer doesn't exists";
        }
    };
    
    let selectLayer = function(id) {
        if(typeof layersDom[id] != undefined) {
            if(selectedLayer)
                selectedLayer.removeClass("layer-selected");

            selectedLayer = layersDom[id];
            selectedLayer.addClass("layer-selected");
        } else {
            throw "Layer doesn't exists";
        }
    };

    let deleteLayer = function(id) {
        if(typeof layersDom[id] != undefined) {
            if(selectedLayer == layersDom[id]) {
                let i = getFirstKeyExcept(id, layersDom);
                EventBus.publish("layer-selected", { id: i });
            }

            layersDom[id].remove();
            delete layersDom[id];
        } else {
            throw "Layer doesn't exists";
        }
    };

    let getFirstKeyExcept = function(key, obj) {
        let keys = Object.keys(obj);
        if(keys.length < 1 || (keys.length == 1 && keys[0] == key + "")) return null;

        if(keys.indexOf(key + "") > -1)
            keys.splice(keys.indexOf(key + ""), 1);

        return keys[0];
    };

    initiaize();
})();