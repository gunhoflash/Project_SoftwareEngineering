class Path {

	/*
		Properties
	*/

	#start_point;
	#end_point;
	#entire_waypoint;
	#remained_waypoint; // include target points and end point
	#remained_path;

	constructor() {
		console.log(`Path here`);
	}

	/*
		Called by AddOnManager.
	*/
	init(currentPosition, currentDirection, targets, end) {
		this.start_point       = start_point;
		this.end_point         = end_point;
		this.entire_waypoint   = target_points;
		this.remained_waypoint = this.entire_waypoint.concat();
		this.remained_path = [];
	}

	/*
		Called by AddOnManager.
	*/
	calculatePath(map, currentPosition, currentDirection) {
		// return path: ['move', 'rotate', ... ]
	}
	
	/*
		Called by AddOnManager.
	*/
	// return 0: remained, -1: fail, 1: success
	getState() {}

	/*
		Called by AddOnManager.
	*/
	getPath() {}

}