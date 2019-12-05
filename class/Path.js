class Path {

	/*

		Properties

	*/

	#remained_path;

	constructor() {
		this.remained_path = [];
	}

	/*

		Methods

	*/

	/*
		Return index of the tile from the array.
		If the tile is not in the array, return -1.
	*/
	#index = (tile, array) => {
		let i, temp_tile;
		for (i = 0; i < array.length; i++) {
			temp_tile = array[i].flat();
			if (temp_tile[0] == tile[0] && temp_tile[1] == tile[1])
				return i;
		}
		return -1;
	}

	/*
		Insert a tile into the open_list if the tile is not in the colsed_list.
	*/
	#insertIntoOpenList = (row, column, prev, open_list, closed_list, map) => {
		// handle exception: the tile is out of the map
		if (!map.isValidPosition([row, column])) return;

		// handle exception: the tile is already in the open_list or closed_list
		if (this.#index([row, column], [].concat(open_list, closed_list)) >= 0) return;

		open_list.push([[row, column], prev]);
	}
	
	/*
		Calculate a path through all target points from current position.
	*/
	calculatePath(map, current_position, current_dir) {
		let total_path = [];
		let remained_target_point = map.getTargets();

		this.remained_path = [];

		// TODO: sort remained_target_point

		/*
			Select a target point to visit.
			Calculate a path from current position to the target point.
			Find all waypoints and insert these into total_path.
		*/
		while (remained_target_point.length > 0) {
			let next_target = remained_target_point.shift();
			let open_list   = [];               // points that need to be checked
			let closed_list = map.getHazards(); // points that don't need to be checked
			let tile;

			open_list.push([current_position, null]); // [current point, prev point]

			// Explore the adjoining points until finding the target point.
			while (true) {

				// select next tile to check
				tile = open_list.shift();

				// if there is no tile to check, we failed.
				if (!tile) return;

				closed_list.push(tile);

				// if the target point found, stop to searching
				if (tile[0][0] == next_target[0] && tile[0][1] == next_target[1]) break;

				// check adjoining tiles
				this.#insertIntoOpenList(tile[0][0] + 1, tile[0][1], tile, open_list, closed_list, map);
				this.#insertIntoOpenList(tile[0][0] - 1, tile[0][1], tile, open_list, closed_list, map);
				this.#insertIntoOpenList(tile[0][0], tile[0][1] + 1, tile, open_list, closed_list, map);
				this.#insertIntoOpenList(tile[0][0], tile[0][1] - 1, tile, open_list, closed_list, map);
			}

			// make the path
			let path = [];
			while (tile != null) {
				path.push(tile[0]);
				tile = tile[1];
			}
			total_path = total_path.concat(path.reverse());

			// set current position to prepare next path-finding
			current_position = next_target;
		}

		// convert the total path to a sequence of commands to use the robot movement interface
		let i, path_x, path_y, real_dir, count;
		for (i = 0; i < total_path.length - 1; i++) {
			path_y = total_path[i + 1][0] - total_path[i][0];
			path_x = total_path[i + 1][1] - total_path[i][1];

			// handle exception: same waypoint
			if (path_x == 0 && path_y == 0) {
				console.log(`ignore same point`);
				continue;
			}

			// calculate next direction
			if (path_x != 0) real_dir = (path_x > 0) ? SIMManager.direction_type.east  : SIMManager.direction_type.west;
			if (path_y != 0) real_dir = (path_y > 0) ? SIMManager.direction_type.south : SIMManager.direction_type.north;
			
			// add commands: rotate
			count = (real_dir - current_dir + 4) % 4;
			while (count--) this.remained_path.push(SIMManager.drive_type.rotate);
			
			// add command: move
			this.remained_path.push(SIMManager.drive_type.move);

			// update current direction
			current_dir = real_dir;
		}
	}

	/*
		Return the remained path or null.
	*/
	getNextCommand() {
		if (this.remained_path.length > 0)
			return this.remained_path.shift();
		else
			return null;
	}
}