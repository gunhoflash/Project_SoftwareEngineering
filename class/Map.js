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
		Initialize the map.
		Create hidden hazards or color blobs at random location.
	*/
	init(info, width, height) {
		let i, j, num_hazard, num_colorblob, defaults = [];

		// set the map size and tiles
		this.info   = info;
		this.width  = width;
		this.height = height;

		// extract all default-type tiles (shuffled)
		for (i = 0; i < height; i++) {
			for (j = 0; j < width; j++) {
				if (info[i][j] == Map.tile_type.default) {
					defaults.splice(parseInt(Math.random() * (defaults.length + 1)), 0, [i, j]);
				}
			}
		}

		/*
			Create 3 hidden colorblob and 3 hidden hazards.
			If the default tiles are not enough to create these hidden points,
			create hidden points until just there is no more default tile.
		*/
		i = 0;
		num_hazard = 3;
		num_colorblob = 3;
		while (i < defaults.length) {
			if (num_colorblob > 0) {
				// make a hidden color blob
				this.info[defaults[i][0]][defaults[i][1]] = Map.tile_type.color_blob_hidden;
				num_colorblob--;
			} else if (num_hazard > 0) {
				// make a hidden hazard
				this.info[defaults[i][0]][defaults[i][1]] = Map.tile_type.hazard_hidden;
				num_hazard--;
			} else break;
			i++;
		}
	}

	/*
		Return whether the tile is a hazard.
	*/
	isHazard(row, column) {
		if (this.isValidPosition([row, column])) {
			return (this.info[row][column] == Map.tile_type.hazard
				|| this.info[row][column] == Map.tile_type.hazard_hidden);
		} else return false;
	}

	/*
		Return whether the tile is a color blob.
	*/
	isColorBlob(row, column) {
		if (this.isValidPosition([row, column])) {
			return (this.info[row][column] == Map.tile_type.color_blob
				|| this.info[row][column] == Map.tile_type.color_blob_hidden);
		} else return false;
	}

	/*
		Return whether the tile is a target.
	*/
	isTarget(row, column) {
		if (this.isValidPosition([row, column])) {
			return (this.info[row][column] == Map.tile_type.target
				|| this.info[row][column] == Map.tile_type.target_visited);
		} else return false;
	}

	/*
		Set the tile's type to hazard.
	*/
	setHazard(row, column) {
		console.log(`setHazard(${row}, ${column})`);
		if (this.isValidPosition([row, column])) {
			this.info[row][column] = Map.tile_type.hazard;
		}
	}

	/*
		Set the tile's type to color blob.
	*/
	setColorBlob(row, column) {
		console.log(`setColorBlob(${row}, ${column})`);
		if (this.isValidPosition([row, column])) {
			this.info[row][column] = Map.tile_type.color_blob;
		}
	}

	/*
		Set the tile's type to visited target.
	*/
	setTargetVisited(row, column) {
		console.log(`setTargetVisited(${row}, ${column})`);
		if (this.isValidPosition([row, column])) {
			this.info[row][column] = Map.tile_type.target_visited;
		}
	}

	/*
		Return the tile informations.
	*/
	getMapInfo() {
		return this.info;
	}

	/*
		Return all unvisited target points for pathfinding.
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
		Return the start point.
		If the start point is not set, return [0, 0].
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
		Return whether the position is within the map or not.
	*/
	isValidPosition(position) {
		if (position[0] < 0 || position[0] >= this.height) return false;
		if (position[1] < 0 || position[1] >= this.width) return false;
		return true;
	}
}