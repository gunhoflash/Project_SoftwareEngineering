class Map {

	/*
		Properties
	*/

	static tile_type = {
		default           : 0,
		hazard            : 1,
		target            : 2,
		color_blob        : 3,
		start             : 4,
		hazard_hidden     : 6,
		color_blob_hidden : 7,
		target_visited    : 8
	};

	#width;
	#height;
	#info;

	constructor() {
		this.width  = 0;
		this.height = 0;
		this.info   = [];
	}

	/*
		Methods
	*/

	/*
		Called by AddOnManager.
	*/
	init(info, width, height) {

		let i, j;

		// set map size and tiles
		this.info   = info;
		this.width  = width;
		this.height = height;

		// create 5 hidden hazards and 3 hidden colorblobs
		let num_hazard = 3, num_colorblob = 3, defaults = [];

		// extract all default points (shuffled)
		for (i = 0; i < height; i++) {
			for (j = 0; j < width; j++) {
				if (info[i][j] == Map.tile_type.default) {
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
				this.info[defaults[i][0]][defaults[i][1]] = Map.tile_type.color_blob_hidden;
				num_colorblob--;
			}
			else if (num_hazard > 0) {
				this.info[defaults[i][0]][defaults[i][1]] = Map.tile_type.hazard_hidden;
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
			return (this.info[row][column] == Map.tile_type.hazard
				|| this.info[row][column] == Map.tile_type.hazard_hidden);
		} else return false;
	}

	/*
		Called by ColorBlobSensor.
	*/
	isColorBlob(row, column) {
		if (this.isValidPosition(row, column)) {
			return (this.info[row][column] == Map.tile_type.color_blob
				|| this.info[row][column] == Map.tile_type.color_blob_hidden);
		} else return false;
	}

	/*
		Called by ColorBlobSensor.
	*/
	isTarget(row, column) {
		if (this.isValidPosition(row, column)) {
			return (this.info[row][column] == Map.tile_type.target
				|| this.info[row][column] == Map.tile_type.target_visited);
		} else return false;
	}

	/*
		Called by AddOnManager.
	*/
	setHazard(row, column) {
		console.log(`setHazard(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.info[row][column] = Map.tile_type.hazard;
		}
	}
	
	/*
		Called by AddOnManager.
	*/
	setColorBlob(row, column) {
		console.log(`setColorBlob(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.info[row][column] = Map.tile_type.color_blob;
		}
	}

	/*
		Called by AddOnManager.
	*/
	setTargetVisited(row, column) {
		console.log(`setTargetVisited(${row}, ${column})`);
		if (this.isValidPosition(row, column)) {
			this.info[row][column] = Map.tile_type.target_visited;
		}
	}

	/*
		Called by this.init() and Path.
		Return 
	*/
	getMapInfo() {
		return this.info;
	}

	/*
		Called by Path.
		Return all target points for pathfinding.
	*/
	getTargets() {
		let i, j, targets = [];
		for (i = 0; i < this.height; i++) {
			for (j = 0; j < this.width; j++) {
				if (this.info[i][j] == Map.tile_type.target)
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
		for (i = 0; i < this.height; i++) {
			for (j = 0; j < this.width; j++) {
				if (this.info[i][j] == Map.tile_type.hazard)
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
		for (i = 0; i < this.height; i++) {
			for (j = 0; j < this.width; j++) {
				if (this.info[i][j] == Map.tile_type.start)
					return [i, j];
			}
		}
		return [0, 0];
	}

	/*
		Called by this.setHazard, this.setColorBlob.
	*/
	isValidPosition(row, column) {
		if (row < 0 || row >= this.height) return false;
		if (column < 0 || column >= this.width) return false;
		return true;
	}

}