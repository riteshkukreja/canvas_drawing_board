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