var Panel = function(title) {
    this.gid = title;
    this.holder = null;
    this.contentHolder = null;
    this.navHolder = null;

    this.selectedTab = null;

    this.initiaize = function(parent) {
        this.holder = $("<div/>", { class: 'panel', id: this.gid });
        let draggingHandle = $("<div/>", { class: 'panel-handle' });
        this.navHolder = $("<div/>", { class: 'nav nav-pills' });
        this.contentHolder = $("<div/>", { class: 'tab-content clearfix' });

        this.holder.append(draggingHandle);
        this.holder.append(this.navHolder);
        this.holder.append(this.contentHolder);

        this.holder.draggable({ scroll: false, handle: '.panel-handle', containment: '#currBoard' });

        $(parent).append(this.holder);
    };

    this.addSubPanel = function(title) {
        let tabA = $("<a/>", { href: '#'+this.gid+'_'+title, 'data-toggle': 'tab', text: title });
        let tabHTML = $("<li/>").append(tabA); 
        let contentHTML = $("<div/>", { class: 'tab-pane', id: this.gid + "_" + title });

        this.navHolder.append(tabHTML);
        this.contentHolder.append(contentHTML);

        tabA.click(e => {
            if(this.selectedTab) {
                this.selectedTab.removeClass("active");
            }
            this.selectedTab = tabHTML;
        });

        if(this.navHolder.length == 1) {
            this.navHolder.children().first().children().first().click();
        }

        return contentHTML;
    };

    this.getSubPanel = function(title) {
        return $(`#{{ this.gid }}_{{ title }}`);
    };

    this.resize = function(width, height) {
        this.holder.css({
            width: width + 'px',
            height: height + 'px'
        });
    };
    
    this.moveTo = function(x, y) {
        let props = {};

        if(x < 0) {
            props['right'] = -x;
        } else {
            props['left'] = x;
        }

        if(y < 0) {
            props['bottom'] = -y;
        } else {
            props['top'] = y;
        }

        this.holder.css(props);
    };

};


 
var LayerFilterPanel = new Panel("layer_filter");
LayerFilterPanel.initiaize($("#panels"));
LayerFilterPanel.resize(300, 500);
LayerFilterPanel.moveTo(window.innerWidth - 300, 50);



