var Board = (function() {
    let imageBoards = {};

    let prevBoardParent = null;
    let nextBoardParent = null;
    
    let currentBoard = null;
    let currContext = null;

    let backBoard = null;
    let backContext = null;

    let dragging = false;
    let selectedLayer = null;
    let width = 400;
    let height = 400;

    let initialize = function() {
        currentBoard = $("<canvas/>", { id: 'currBoard' });
        currContext = currentBoard[0].getContext('2d');
        
        backBoard = $("<canvas/>");
        backContext = backBoard[0].getContext('2d');

        currentBoard.on("mousedown", dragIn);
        currentBoard.on("mousemove", putPoint);
        currentBoard.on("mouseup", dragOut);

        prevBoardParent = $("<div/>");
        nextBoardParent = $("<div/>");
    };

    let bootstrap = function(parent) {
        initialize();

        $(parent).append(prevBoardParent);
        $(parent).append(currentBoard);
        $(parent).append(nextBoardParent);

        EventBus.subscribe("layer-selected", (event, data) => {
            updateAllCanvas(data.id);

            if(data.id) {
                selectedLayer = LayerManager.get(data.id);
            } else {
                selectedLayer = null;
            }
        });

        EventBus.subscribe("layer-visiblity-changed", (event, data) => {
            if(selectedLayer == LayerManager.get(data.id)) {
                // if visibility changed for current board
                if(data.visible)
                    selectedLayer.apply(currContext);
                else
                    currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
            } else {
                if(data.visible)
                    imageBoards[data.id].removeClass('invisible');
                else
                    imageBoards[data.id].addClass('invisible');
            }
        });

        EventBus.subscribe("layer-alpha-changed", (event, data) => {
            // if layer is not visible, do nothing
            if(!LayerManager.get(data.id).visibility) return;

            if(selectedLayer.getId() == data.id) {
                // current layer opacity is changed, redraw
                currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
                selectedLayer.apply(currContext);
            } else {
                // other layer opacity has changed, chnage css opacity of the layer image, will be never called hopefully
                imageBoards[data.id].css({ opacity: data.alpha });
            }
        });

        EventBus.subscribe("draw-point-success", (event) => {
            if(selectedLayer) {
                selectedLayer.update(backBoard[0], backContext, backBoard.attr('width'), backBoard.attr('height'));

                // current layer opacity is changed, redraw
                //currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
                selectedLayer.applyDrawing(currContext, currentBoard.attr('width'), currentBoard.attr('height'));
            }
        });

        EventBus.subscribe("filter-apply", (event, filter) => {
            if(selectedLayer) {
                filter.apply(backContext);

                selectedLayer.update(backBoard[0], backContext, backBoard.attr('width'), backBoard.attr('height'));
                
                // current layer opacity is changed, redraw
                //currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
                selectedLayer.applyDrawing(currContext, currentBoard.attr('width'), currentBoard.attr('height'));
            }
        });
    };

    let updateAllCanvas = function(id) {
        /** Clear all context */
        clearAllCanvas();
        
        /** If arbitrary layer is selected,, load it in current context */
        LayerManager.getAllLayers((val, i) => {
            if(i < id) {
                // draw image in previous boards array
                let image = createImageBoard(i, val.getImageSrc(), width, height, val.visibility, val.alpha);
                imageBoards[i] = image;
                prevBoardParent.append(image);
            } else if(i == id && val.visibility) {
                val.apply(currContext);
                val.apply(backContext, true);
                selectedLayer = val;
            } else {
                // draw image in next boards array
                let image = createImageBoard(i, val.getImageSrc(), width, height, val.visibility, val.alpha);
                imageBoards[i] = image;
                nextBoardParent.append(image);
            }
        });
    };

    let createImageBoard = function(id, src, width, height, visible, opacity) {
        return $("<img/>", {
            src: src,
            'data-id': id,
            class: 'board-img ' + (visible ? '': 'invisible'),
            width: width,
            height: height
        }).css({ opacity: opacity });
    };

    let putPoint = function(e) {
        if(dragging && selectedLayer && selectedLayer.visibility) {
            EventBus.publish('pen-clicked', new Position(e.clientX, e.clientY-50));
            
            EventBus.publish('draw-point', {
                position: new Position(e.clientX, e.clientY-50),
                context: backContext
            });
        }
    };
    
    let dragOut = function () {
        dragging = false;
        backContext.beginPath();
    };
    
    let dragIn = function (e) {
        dragging = true;
        putPoint(e);
    };

    let resize = function(w, h) {
        currentBoard.attr('width', w);
        currentBoard.attr('height', h);
        
        backBoard.attr('width', w);
        backBoard.attr('height', h);

        width = w;
        height = h;

        for(let key in imageBoards) {
            let img = imageBoards[key];
            img.attr('width', w);
            img.attr('height', h);
        }
    };

    let clearAllCanvas = function() {
        currContext.clearRect(0, 0, currentBoard.attr('width'), currentBoard.attr('height'));
        backContext.clearRect(0, 0, backBoard.attr('width'), backBoard.attr('height'));

        prevBoardParent.children().remove();
        nextBoardParent.children().remove();

        prevBoards = [];
        nextBoards = [];
    };

    let getContext = function() {
        return currContext;
    };

    let getImage = function() {
        let dummyCanvas = $("<canvas/>");
        let dummyContext = dummyCanvas[0].getContext('2d');
        
        dummyCanvas.attr('width', currentBoard.attr('width'));
        dummyCanvas.attr('height', currentBoard.attr('height'));

        LayerManager.getAllLayers((layer) => {
            if(!layer.visibility) return;

            layer.apply(dummyContext);
        });

        return dummyCanvas[0].toDataURL('image/png');
    };

    return {
        bootstrap: bootstrap,
        resize: resize,
        getImage: getImage
    };
})();