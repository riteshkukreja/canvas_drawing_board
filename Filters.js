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

var FilterManager = new (function() {
    let filters = {};
    let idCounter = 1;

    this.add = function(filter) {
        if(filter instanceof Filter) {
            filters[idCounter] = filter;
            filter.setId(idCounter);
            idCounter++;
            EventBus.publish("filter-add", { id: filter.getId(), name: filter.getName() });
        } else {
            throw "Not a filters object";
        }
    };

    this.update = function(id) {
        if(id in filters) {
            filters[id].update();
        } else {
            throw "Not a valid filter";
        }
    };

    this.get = function(id) {
        if(id in filters) {
            return filters[id];
        } else {
            throw "Not a valid filter";
        }
    };
    
    this.rename = function(id, name) {
        if(id in filters) {
            filters[id].rename(name);
            EventBus.publish("filter-rename", { id: id, name: name });
        } else {
            throw "Not a valid filter";
        }
    };

    this.delete = function(id) {
        if(id in filters) {
            delete filters[id];
            EventBus.publish("filter-deleted", { id: id });
        }
    };

    this.apply = function(id, context) {
        if(id in filters) {
            filters[id].apply(context);
        }
    };

    let initiaize = function() {
        EventBus.subscribe('add-filter', (event, layer) => {
            let filter = new Filter(layer.name);
            filter.updateContent(layer.getImageSrc());

            FilterManager.add(filter);
        });
    };

    initiaize();
})(); 

var FiltersPanel = (function() {
    let panel = LayerFilterPanel;
    let filtersDom = {};
    let filterHolder = null;
    let selectedFilter = null;

    let initiaize = function() {
        filterHolder = panel.addSubPanel("Filters");

        EventBus.subscribe("filter-add", function(event, data) {
            addFiltersAtEnd(data.id, data.name);
        });

        EventBus.subscribe("filter-rename", function(event, data) {
            renameFilter(data.id, data.name);
        });

        EventBus.subscribe("filter-selected", function(event, data) {
            selectFilter(data.id);
        });
        
        EventBus.subscribe("filter-deleted", function(event, data) {
            deleteFilter(data.id);
        });

        addTopControls();
    };

    let addTopControls = function() {
        let controlHolder = $("<div/>", { class: 'controls' });

        let applyControl = $("<i/>", { class: 'applyIcon' });
        applyControl.click(e => {
            // TODO apply selected filter to main canvas
            if(selectedFilter) {
                let fil = FilterManager.get(selectedFilter.data('id'));
                EventBus.publish("filter-apply", fil);
            }
        });

        let deleteControl = $("<i/>", { class: 'deleteIcon' });
        deleteControl.click(e => {
            // TODO delete filter
            if(selectedFilter)
                FilterManager.delete(selectedFilter.data('id'));
        });
        
        controlHolder.append(applyControl);
        controlHolder.append(deleteControl);

        filterHolder.append(controlHolder);
    };
    
    let addFilterControls = function() {
        let controlHolder = $("<div/>", { class: 'controls' });
        
        let renameFilterControl = $("<i/>", { class: 'renameIcon' });
        renameFilterControl.click(e => {
            onRenameHandler($(e.target).parent().parent());
        });

        controlHolder.append(renameFilterControl);

        return controlHolder;
    };

    let onRenameHandler = function(parent) {
        let id = parent.data('id');
        let name = parent.children().first().text();

        let nameInput = $("<input/>", { type: 'text', value: name, class: 'layer-input' });
        nameInput.on('blur', e => {
            // TODO rename filter from manager
            FilterManager.rename(id, nameInput.val());

            nameInput.remove();
            parent.children().first().removeClass("hidden");
        });

        nameInput.on('keyup', e => {
            let code = e.keyCode || e.charCode || e.which;
            if(code == 13) {
                // TODO rename filter from manager
                FilterManager.rename(id, nameInput.val());
                
                nameInput.remove();
                parent.children().first().removeClass("hidden");
            }
        });
        
        parent.append(nameInput);
        parent.children().first().addClass("hidden");

        nameInput.focus();
    }

    let addFiltersAtEnd = function(id, name) {
        let filter = $("<div/>", { 'data-id': id, class: 'layer' });
        let filterTitle = $("<span/>", { html: name });

        filter.click(e => {
            EventBus.publish("filter-selected", { id: id });
        });

        filter.dblclick(e => {
            onRenameHandler($(e.target));
        });

        filterTitle.dblclick(e => {
            onRenameHandler($(e.target).parent());
        });

        filter.append(filterTitle);
        filter.append(addFilterControls());

        filterHolder.append(filter);
        filtersDom[id] = filter;
        
        EventBus.publish("filter-selected", { id: id });
    };

    let renameFilter = function(id, name) {
        if(typeof filtersDom[id] != undefined) {
            let selectedFilter = filtersDom[id];
            selectedFilter.children().first().text(name);
        } else {
            throw "Filter doesn't exists";
        }
    };
    
    let selectFilter = function(id) {
        if(typeof filtersDom[id] != undefined) {
            if(selectedFilter)
                selectedFilter.removeClass("layer-selected");

            selectedFilter = filtersDom[id];
            selectedFilter.addClass("layer-selected");
        } else {
            throw "Filter doesn't exists";
        }
    };
    
    let deleteFilter = function(id) {
        if(typeof filtersDom[id] != undefined) {
            filtersDom[id].remove();
        } else {
            throw "Filter doesn't exists";
        }
    };

    initiaize();
})();