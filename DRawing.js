class Drawing {
	private var board,
				context,
				radius;

	public function __construct__(id) {
		board = document.getElementById(id),
		context = board.getContext('2d'),
		radius = 10;
	}

	public function deg2rad(deg) {
		return (Math.PI / 180) * deg;
	}
};