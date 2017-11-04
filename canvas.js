
var board = document.getElementById("board"),
	context = board.getContext('2d'),
	dragging = false;

board.width = window.innerWidth;
board.height = window.innerHeight;

/**********************Brushes*****************/
BrushLoader.bootstrap(document.getElementById("brushes"));

/**********************COLORS*****************/
ColorLoader.bootstrap(document.getElementById("colors"));

var putPoint = function(e) {
	if(dragging) {
		BrushLoader.draw(
			new Position(e.clientX, e.clientY), 
			ColorLoader.getSelected().toString(), 
			context
		);
	}
}

var dragOut = function () {
	dragging = false;
	context.beginPath();
}

var dragIn = function (e) {
	dragging = true;
	putPoint(e);
}

board.addEventListener("mousedown", dragIn);
board.addEventListener("mousemove", putPoint);
board.addEventListener("mouseup", dragOut);

/**********************Clear Canvas*******************/
clearBtn.draw(document.getElementById("btns"));

/**********************SAVING IMAGE *******************/
downloadBtn.draw(document.getElementById("btns"));