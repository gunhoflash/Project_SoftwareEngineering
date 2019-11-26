class Map {

	/*
		Properties
	*/

	static tile_type = {
		default   : 0,
		target    : 1,
		hazard    : 2,
		colorblob : 3,
		start     : 4,
		end       : 5
	}

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
	init(map_info, width, height) {

		// set map size
		this.width = width;
		this.height = height;

		// set tiles
		this.map_info = map_info;
	}

	/*
		Called by AddOnManager.
	*/
	setHazard(row, column) {
		if (isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_type.hazard;
		}
	}


	/*
		Called by AddOnManager.
	*/
	setColorBlob(row, column) {
		if (isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_type.colorblob;
		}
	}

	/*
		Called by Path.
		Return all target points for pathfinding.
	*/
	getTargets() {
		let i, j, targets = [];
		for (i = 0; i < this.map_height; i++) {
			for (j = 0; j < this.map_width; j++) {
				if (this.map_info[i][j] == Map.tile_type.target)
					targets.push([i, j]);
			}
		}
		return targets;
	}
	
	/*
		Called by Path.
		Return all hazard points for pathfinding.
	*/
	getHazards() {
		let i, j, hazards = [];
		for (i = 0; i < this.map_height; i++) {
			for (j = 0; j < this.map_width; j++) {
				if (this.map_info[i][j] == Map.tile_type.hazard)
				hazards.push([i, j]);
			}
		}
		return hazards;
	}
	/*
		Called by this.setHazard, this.setColorBlob.
	*/
	#isValidPosition(row, column) {
		if (row < 0 || row >= height) return false;
		if (column < 0 || column >= width) return false;
		return true;
	}

}