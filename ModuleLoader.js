var ModuleLoader = (function() {
    let Modules = [
        /** Jquery */
        "https://code.jquery.com/jquery-3.2.1.min",
        "https://code.jquery.com/ui/1.12.1/jquery-ui",

        /** Bootstrap */
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min",

        /** Utils */
        "utils/EventBus",
        "utils/Brush",
        "utils/Color",
        "utils/Layer",
        "utils/Position",
        "utils/Filter",
    
        /** Managers */
        "managers/FilterManager",
        "managers/LayerManager",
    
        /** UI */
        "ui/Board",
        "ui/Panel",
        "ui/Swatch",
        "ui/ControlSwatch",
        "ui/BrushLoader",
        "ui/ColorLoader",
        "ui/LayersPanel",
        "ui/FiltersPanel",
    
        /** Custom */
        "scripts/brushes",
        "scripts/colors",
        "scripts/buttons"
    ];
    
    let totalScripts = Modules.length;

    let loadModules = function()  {
        loadscripts(Modules, onInitialized);
    };
    
    let loadscripts = function(scripts, complete) {
        if(scripts.length == 0) {
            complete();
            return;
        }

        let loadScript = (src) => {
            return new Promise((resolve, reject) => {
                let scriptTag = document.createElement("script");
                scriptTag.setAttribute("src", src + ".js");
                scriptTag.addEventListener("load", (e) => {
                    console.log("Loaded ", src);
                    resolve();
                });

                document.head.appendChild(scriptTag);  
            }); 
        };

        loadScript(scripts[0])
            .then(() => {
                scripts.splice(0, 1);
                loadscripts(scripts, complete);
            });
    };
    
    let onInitialized = function() {
        /**********************Brushes*****************/
        BrushLoader.bootstrap(document.getElementById("brushes"));
    
        /**********************COLORS*****************/
        ColorLoader.bootstrap(document.getElementById("colors"));
    
        /**********************SAVING IMAGE *******************/
        downloadBtn.draw(document.getElementById("btns"));
    
        /**********************Drawing****************/
        Board.bootstrap(document.getElementById("canvas_holder"));
        Board.resize(window.innerWidth, window.innerHeight - 50);
    
        /**********************Layers**************************/
        LayerManager.add(new Layer("background"));
    };
    
    let showProgress = function() {
        return Math.floor(((totalScripts - Modules.length) / totalScripts) * 100 );
    };

    return {
        showProgress: showProgress,
        start: loadModules,
        completed: () => (showProgress() == 100)
    };
})();