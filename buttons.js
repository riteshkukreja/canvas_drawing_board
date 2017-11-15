var downloadBtn = new Swatch(function() {
    var btn = document.createElement("a");
    btn.classList.add("downloadbtn");
    btn.setAttribute("download", "image.png");

    btn.addEventListener("click", function(e) {
        var dt = Board.getImage();
        this.href = dt.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }, false);

    return btn;
});