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