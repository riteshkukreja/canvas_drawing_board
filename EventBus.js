let EventBus = new (function() {
    this.dom = $("<div/>");

    this.subscribe = function(event, callback) {
        this.dom.on(event, callback);
    };

    this.unsubscribe = function(event, callback) {
        this.dom.off(event, callback);
    };

    this.publish = function(event, data) {
        this.dom.trigger(event, data);
    };

})();