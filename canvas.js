
	var board = document.getElementById("board"),
		context = board.getContext('2d'),
		radius = 10,
		dragging = false;

	board.width = window.innerWidth;
	board.height = window.innerHeight;

	context.lineWidth = 2 * radius;

	var deg2rad = function (deg) {
		return (Math.PI / 180) * deg;
	}

	var putPoint = function(e) {
		if(dragging) {
			context.lineTo(e.clientX, e.clientY);
			context.stroke();
			context.beginPath();
			context.arc(e.clientX, e.clientY, radius, deg2rad(0), deg2rad(360));
			context.fill();

			context.beginPath();
			context.moveTo(e.clientX, e.clientY);
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

	
/*******************RADIUS******************/

var minRadius = 0.5,
	maxRadius = 100,
	defaultRadius = 10,
	interval = 5,
	radSpan = document.getElementById('radval'),
	decrad = document.getElementById('decrad'),
	incrad = document.getElementById('incrad');

var setRadius = function(rad) {
	if(rad < minRadius) {
		rad = minRadius;
	} 
	if(rad > maxRadius) {
		rad = maxRadius;
	}

	radius = rad;
	context.lineWidth = 2*radius; 
	radSpan.innerHTML = radius;
	//updateInterval();
}

var updateInterval = function() {
	if(radius >= 50)	interval = 20;
	else if(radius >= 20)	interval = 15;
	else if(radius >= 10)	interval = 10;
	else if(radius >= 5)	interval = 5;
	else if(radius >= 1)	interval = 1;
	else interval = 0.5;
}

var decrementRadius = function() {
	setRadius(radius - interval);
}

var incrementRadius = function() {
	setRadius(radius + interval);
}

decrad.addEventListener("click", decrementRadius);
incrad.addEventListener("click", incrementRadius);
setRadius(defaultRadius);

/**********************COLORS*****************/

var colors = ["black", "red", "green", "blue", "grey", "white"];

var colorPalete = document.getElementById("colors");

var setColor = function(color) {
	alert(color);
	context.strokeStyle = color;
	context.fillStyle = color;
}

var setSwatch = function(e) {
	var swatch = e.target;

	if(swatch) {
		if (swatch.currentStyle) {
		    var color = swatch.currentStyle.backgroundColor;
		    setColor(color);
		} else if (window.getComputedStyle) {
		    var color = window.getComputedStyle(swatch).backgroundColor;
		    setColor(color);
		} else {
			var color = "#069";
			setColor(color);
		}
		
		var active = document.getElementsByClassName('active')[0];
		if(active) active.classList.remove ('active');

		swatch.classList.add('active');
	}
}

for(var i = 0, n = colors.length; i < n ; i++) {
	var swatch = document.createElement('div');
	swatch.classList.add("swatch");
	swatch.classList.add(colors[i]);
	swatch.addEventListener("click", setSwatch);

	colorPalete.appendChild(swatch);
}

setSwatch(document.getElementsByClassName('swatch')[0]);


/**********************SAVING IMAGE *******************/

var saveButton = document.getElementById("save"),
	destination = 'save.php';

function saveImage() {
	var data = canvas.toDataURL();

	var request = new XMLHttpRequest();

	request.onReadyStateChange = function() {
		if(request.readyState == 4 && request.status == 200) {
			var file = request.responseText;
			
		}
	}
	
	request.open('POST', destination, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	request.send('img=' + data);
}

saveButton.addEventListener("click", saveImage);