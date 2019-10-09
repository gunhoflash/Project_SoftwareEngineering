class Map {

	constructor(width, height, probability_danger, probability_target) {
		this.init(width, height, probability_danger, probability_target);
	}

	init(width, height, probability_danger, probability_target) {
		this.width  = width;
		this.height = height;
		this.tile   = [];

		probability_target += probability_danger;

		let i, j, r;
		for (i = 0; i < this.height; i++)
		{
			this.tile[i] = [];
			for (j = 0; j < this.width; j++)
			{
				r = Math.random();
				     if (r < probability_danger) this.tile[i][j] = 'X'; // danger
				else if (r < probability_target) this.tile[i][j] = 'O'; // target
				else                             this.tile[i][j] = ' '; // normal
			}
		}
		console.log(`Map(${this.width}*${this.height}) initialized`);
		console.log(this.tile);
	}

	// read a tile
	getTile(i, j) {
		console.log(`tile[${i}][${j}]: ${this.tile[i][j]}`);
		return this.tile[i][j];
	}

	// read all tile for visualizing
	getAllTiles() {
		return this.tile;
	}
}