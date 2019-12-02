class Path {

	/*
		Properties
	*/

	#remained_path;

	constructor() {
		this.remained_path = [];
	}

	/*
		Called by AddOnManager.
	*/
	
	// return index of the tile from tiles or -1 when not found
	index(tiles, _tile) {
		let i, temp_tile;
		for (i = 0; i < tiles.length; i++) {
			temp_tile = tiles[i].flat();
			if (temp_tile[0] == _tile[0] && temp_tile[1] == _tile[1])
				return i;
		}
		return -1;
	}

	// insert tile into the open_list if the tile is not in the colsed_list
	insertIntoOpenList(row, column, prev, open_list, closed_list, map) {
		// handle exception: the tile is out of the map
		if (!map.isValidPosition(row, column)) return;

		// handle exception: the tile is already in the open_list or closed_list
		if (this.index([].concat(open_list, closed_list), [row, column]) < 0)
			open_list.push([[row, column], prev]);
	}
	
	// calculate remained path
	calculatePath(map, currentPosition, current_dir) {
		let total_path = [];
		let remained_target_point = map.getTargets();

		this.remained_path = [];

		// TODO: sort remained_target_point

		// find all waypoints and insert into total_path
		while (remained_target_point.length > 0) {
			let open_list   = []; // point robot want to visit
			let closed_list = map.getHazards(); // already visited point
			let path        = [];
			let next_target = remained_target_point.shift();
			let tile;

			open_list.push([currentPosition, null]); // [current point, prev point]

			while (true) {

				// select next tile
				tile = open_list.shift();

				// no more tile to visit. failed to find a path
				if (!tile) return;

				closed_list.push(tile);

				// find the target point
				if (tile[0][0] == next_target[0] && tile[0][1] == next_target[1]) break;

				// check surrounding tiles
				this.insertIntoOpenList(tile[0][0] + 1, tile[0][1], tile, open_list, closed_list, map);
				this.insertIntoOpenList(tile[0][0] - 1, tile[0][1], tile, open_list, closed_list, map);
				this.insertIntoOpenList(tile[0][0], tile[0][1] + 1, tile, open_list, closed_list, map);
				this.insertIntoOpenList(tile[0][0], tile[0][1] - 1, tile, open_list, closed_list, map);
			}

			// make a path
			while (tile != null) {
				path.push(tile[0]);
				tile = tile[1];
			}
			total_path = total_path.concat(path.reverse());

			currentPosition = next_target;
		}

		// convert the total path to a sequence of commands to use the robot movement interface 
		let i, path_x, path_y, real_dir, count;
		for (i = 0; i < total_path.length - 1; i++) {
			path_y = total_path[i + 1][0] - total_path[i][0];
			path_x = total_path[i + 1][1] - total_path[i][1];

			// handle exception: same point
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

		console.log(`path calculated: ${this.remained_path}`);
	}

	/*
		Called by AddOnManager.
	*/
	getNextCommand() {
		if (this.remained_path.length > 0)
			return this.remained_path.shift();
		else
			return null;
	}

}