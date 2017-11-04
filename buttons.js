var downloadBtn = new Swatch(function() {
    var btn = document.createElement("a");
    btn.classList.add("downloadbtn");
    btn.setAttribute("download", "image.png");

    btn.addEventListener("click", function(e) {
        var dt = board.toDataURL('image/png');
        this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }, false);

    return btn;
});

var clearBtn = new Swatch(function() {
    var btn = document.createElement("a");
    btn.classList.add("clearbtn");

    btn.addEventListener("click", function(e) {
        context.clearRect(0, 0, board.width, board.height);
    }, false);

    return btn;
});