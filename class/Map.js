class Map {

	/*
		Properties
	*/

	static tile_default   = 0;
	static tile_target    = 1;
	static tile_hazard    = 2;
	static tile_colorblob = 3;

	#map_width;
	#map_height;
	#map_info;

	constructor() {
		console.log(`Map here`);
		this.map_width = 0;
		this.map_height = 0;
		this.map_info = [];
	}

	/*
		Methods
	*/

	/*
		Called by AddOnManager.
	*/
	initMap(width, height) {
		let i, j;

		// init map size
		this.width = width;
		this.height = height;

		// init tiles
		this.map_info = [];
		for (i = 0; i < height; i++) {
			this.map_info[i] = [];
			for (j = 0; j < width; j++) {
				this.map_info[i][j] = Map.tile_default;
			}
		}
	}

	/*
		Called by AddOnManager.
	*/
	setTarget(row, column) {
		if (isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_target;
		}
	}

	/*
		Called by AddOnManager.
	*/
	setHazard(row, column) {
		if (isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_hazard;
		}
	}


	/*
		Called by AddOnManager.
	*/
	setColorBlob(row, column) {
		if (isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_colorblob;
		}
	}

	/*
		Called by AddOnManager.
	*/
	getTarget() {}

	/*
		Called by AddOnManager.
	*/
	getHazard() {}

	/*
		Called by AddOnManager.
	*/
	getColorBlob() {}

	/*
		Called by this.setHazard, this.setColorBlob.
	*/
	#isValidPosition(row, column) {
		if (row < 0 || row >= height) return false;
		if (column < 0 || column >= width) return false;
		return true;
	}

}