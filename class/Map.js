class Map {

	/*
		Properties
	*/

	static tile_type = {
		default   : 0,
		hazard    : 1,
		target    : 2,
		colorblob : 3,
		start     : 4,
		end       : 5,
		hazard_hidden    : 6,
		colorblob_hidden : 7,
		target_visited   : 8
	};

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

		let i, j;

		// set map size and tiles
		this.map_info   = map_info;
		this.map_width  = width;
		this.map_height = height;

		// return;

		// create 5 hidden hazards and 3 hidden colorblobs
		let num_hazard = 3, num_colorblob = 3, defaults = [];

		// extract all default points (shuffled)
		for (i = 0; i < height; i++) {
			for (j = 0; j < width; j++) {
				if (map_info[i][j] == Map.tile_type.default) {
					// push a point with random index
					defaults.splice(parseInt(Math.random() * (defaults.length + 1)), 0, [i, j]);
				}
			}
		}

		/*
			Create 3 hidden colorblob and 5 hidden hazards.
			If the default tiles are not enough to create these hidden points,
			create hidden points until just there is no more default tile.
		*/
		i = 0;
		while (i < defaults.length) {
			if (num_colorblob > 0) {
				this.map_info[defaults[i][0]][defaults[i][1]] = Map.tile_type.colorblob_hidden;
				num_colorblob--;
			}
			else if (num_hazard > 0) {
				this.map_info[defaults[i][0]][defaults[i][1]] = Map.tile_type.hazard_hidden;
				num_hazard--;
			} else break;
			i++;
		}
	}

	/*
		Called by HazardSensor.
	*/
	isHazard(row, column) {
		if (this.isValidPosition(row, column)) {
			return (this.map_info[row][column] == Map.tile_type.hazard
				|| this.map_info[row][column] == Map.tile_type.hazard_hidden);
		} else return false;
	}

	/*
		Called by ColorBlobSensor.
	*/
	isColorBlob(row, column) {
		if (this.isValidPosition(row, column)) {
			return (this.map_info[row][column] == Map.tile_type.colorblob
				|| this.map_info[row][column] == Map.tile_type.colorblob_hidden);
		} else return false;
	}

	/*
		Called by ColorBlobSensor.
	*/
	isTarget(row, column) {
		if (this.isValidPosition(row, column)) {
			return (this.map_info[row][column] == Map.tile_type.target
				|| this.map_info[row][column] == Map.tile_type.target_visited);
		} else return false;
	}

	/*
		Called by AddOnManager.
	*/
	setHazard(row, column) {
		console.log(`setHazard(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_type.hazard;
		}
	}
	
	/*
		Called by AddOnManager.
	*/
	setColorBlob(row, column) {
		console.log(`setColorBlob(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_type.colorblob;
		}
	}

	/*
		Called by AddOnManager.
	*/
	setTargetVisited(row, column) {
		console.log(`setTargetVisited(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.map_info[row][column] = Map.tile_type.target_visited;
		}
	}

	/*
		Called by this.init() and Path.
		Return 
	*/
	getMapInfo() {
		return this.map_info;
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
		Return all known hazard points for pathfinding.
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
		Called by ADD-ON.
		Return start point.
	*/
	getStartPoint() {
		let i, j;
		for (i = 0; i < this.map_height; i++) {
			for (j = 0; j < this.map_width; j++) {
				if (this.map_info[i][j] == Map.tile_type.start)
					return [i, j];
			}
		}
		return [0, 0];
	}

	/*
		Called by Path.
		Return end point.
	*/
	getEndPoint() {
		let i, j;
		for (i = 0; i < this.map_height; i++) {
			for (j = 0; j < this.map_width; j++) {
				if (this.map_info[i][j] == Map.tile_type.end)
					return [i, j];
			}
		}
		return [0, 0];
	}

	/*
		Called by this.setHazard, this.setColorBlob.
	*/
	isValidPosition(row, column) {
		if (row < 0 || row >= this.map_height) return false;
		if (column < 0 || column >= this.map_width) return false;
		return true;
	}

}