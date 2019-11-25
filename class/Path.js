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
	initPoint(start_point, end_point, target_points) {
		this.start_point           = start_point;
		this.end_point             = end_point;
		this.entire_target_point   = target_points;
		this.remained_target_point = this.entire_target_point.concat();
		this.remained_path = [];
	}

	/*
		Called by AddOnManager.
	*/
	calculatePath(map, currentPosition) {}
	
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