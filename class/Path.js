class Path {

	/*
		Properties
	*/
	#start_point;
	#end_point;
	#entire_target_point;
	#remained_target_point;
	#remained_path;
	
	constructor() {
		console.log(`Path here`);
	}
	/*
		Called by AddOnManager.
	*/
	initPoint(start_point, target_points) {
		this.start_point           = start_point;
		this.entire_target_point   = target_points;
		this.remained_target_point = this.entire_target_point.concat();
		this.remained_path         = [];
	}
	
	/*
		Called by AddOnManager.
	*/
	
	// Find same array and return index
	index(tiles, _tile) {
		let i, temp_tile;
		for (i = 0; i < tiles.length; i++) {
			temp_tile = tiles[i].flat();
			if (temp_tile[0] != _tile[0]) continue;
			if (temp_tile[1] != _tile[1]) continue;
			return i;
		}
		return -1;
	}
 
	// Calculate Manhattan Distane for A* algorithm
	calculate_f(ar, end_point) {
		return ar[1] + Math.abs(ar[0] - end_point[0]) + Math.abs(ar[1] - end_point[1]);
	}
	
	// A* algorithm for pathfinding
	search_tile(map, parent_tile, tile, open_list, closed_list, hazard_info) {
		// console.log(`search_tile with ${tile}, ${map.map_width}, ${map.map_height}`);

		// handle exception: the tile is out of the map
		if (tile[0] < 0 || tile[0] >= map.map_width)  return open_list;
		if (tile[1] < 0 || tile[1] >= map.map_height) return open_list;
		
		if (this.index(hazard_info, tile) == -1 && this.index(closed_list, tile) == -1) {
			// the tile is not hazard
			// the tile is not in the closed_list

			let num = this.index(open_list, tile);
			if (num != -1) {
				// the tile is in the open_list
				if (parent_tile[1] + 1 < open_list[num][1]) {
					open_list[num][2] = parent_tile;
					open_list[num][1] = parent_tile[1] + 1;
				}
			} else {
				// the tile is not in the open_list
				let tmp_tile = [];
				tmp_tile.push(tile);
				tmp_tile.push(parent_tile[1] + 1);
				tmp_tile.push(parent_tile[0]);
				open_list.push(tmp_tile);
			}
		}

		return open_list;
	}
	
	// calculate remained path using A* algorithm
	calculatePath(map, currentPosition, current_dir) {
		let total_path = [];
		while (this.remained_target_point.length != 0) {
			let open_list   = []; // point robot want to visit
			let closed_list = []; // already visited point
			let path        = [];
			let hazard_info = map.getHazards();
			let end_point   = this.remained_target_point.shift();

			open_list.push([currentPosition, 0, null]); // point, G value, prev point
			let tmp_tile;
			while (true) {

				// no more tile to visit
				if (open_list.length == 0) {
					this.remained_path = [];
					return -1;
				}

				// sort open_list and choose one with the minimum distance value
				open_list.sort(function (a, b) {
					return this.calculate_f(a, end_point) - this.calculate_f(b, end_point);
				}.bind(this));
				tmp_tile = open_list[0];

				closed_list.push(tmp_tile);

				// find path to target point
				if (tmp_tile[0][0] == end_point[0] && tmp_tile[0][1] == end_point[1]) {
					path.push(tmp_tile[0]);
					break;
				}

				// check four-way distance
				open_list = this.search_tile(map, tmp_tile, [tmp_tile[0][0] + 1, tmp_tile[0][1]], open_list, closed_list, hazard_info);
				open_list = this.search_tile(map, tmp_tile, [tmp_tile[0][0] - 1, tmp_tile[0][1]], open_list, closed_list, hazard_info);
				open_list = this.search_tile(map, tmp_tile, [tmp_tile[0][0], tmp_tile[0][1] + 1], open_list, closed_list, hazard_info);
				open_list = this.search_tile(map, tmp_tile, [tmp_tile[0][0], tmp_tile[0][1] - 1], open_list, closed_list, hazard_info);
				open_list.shift();
			}

			// make a path
			while (tmp_tile[2] != null) {
				for (let i = 0; i < closed_list.length; i++) {
					if (tmp_tile[2] == null) {
						path.push(closed_list[i][0]);
						break;
					}
					if (closed_list[i][0][0] == tmp_tile[2][0] && closed_list[i][0][1] == tmp_tile[2][1]) {
						path.push(closed_list[i][0]);
						tmp_tile = closed_list[i];
						break;
					}
				}
			}

			currentPosition = end_point;
			path.reverse();
			console.log(`part-path add: ${path}`);
			// path.shift();
			total_path = total_path.concat(path);
		}

		// convert the total path to a sequence of commands to use the robot movement interface 
		let move_path = [];
		let i, j, path_x, path_y, real_dir, count;
		for (i = 0; i < total_path.length - 1; i++) {
			path_y = total_path[i + 1][0] - total_path[i][0];
			path_x = total_path[i + 1][1] - total_path[i][1];

			// handle exception: same point
			if (path_x == 0 && path_y == 0) {
				console.log(`ignore same point`);
				continue;
			}

			// Calculate next direction
			if (path_y == 0)
				real_dir = (path_x == 1) ? SIMManager.direction_type.east : SIMManager.direction_type.west;
			else
				real_dir = (path_y == 1) ? SIMManager.direction_type.south : SIMManager.direction_type.north;

			count = real_dir - current_dir;
			if (count < 0) count += 4;

			// rotate and move
			for (j = 0; j < count; j++)
				move_path.push(SIMManager.drive_type.rotate);
			move_path.push(SIMManager.drive_type.move);

			// update current direction
			current_dir = real_dir;
		}

		this.remained_path = move_path;
		console.log(`path calculated: ${this.remained_path}`);
		return 1;
	}

	/*
		Called by AddOnManager.
	*/
	// return 0: remained, -1: fail, 1: success
	getState() {
		if (this.remained_path.length == 0) return 1;
		else return 0;
	}

	/*
		Called by AddOnManager.
	*/
	getPath() {
		return this.remained_path;
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