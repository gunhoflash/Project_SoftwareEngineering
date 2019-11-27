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
	calculatePath(map, currentPosition) {
		//var easystar = new EasyStar.js(); // in Web

		var easystarjs = require('easystarjs'); // in node.js
		var easystar = new easystarjs.js();

		current_dir = currentPosition[2]; //It means current direction

		tmp_map = map.map_info;

		real_dir = 0;
		count = 0;

		easystar.setGrid(tmp_map);
		easystar.setAcceptableTiles([0,1,3,4,5]);       //Set tile number we can go

		easystar.findPath(currentPosition[0], currentPosition[1], this.remained_target_point[0][0], this.remained_target_point[0][1], 
			function( path ){
				if (path === null) {
					console.log("Path was not found.");
				} else {
					console.log(path);
				}
			}
		);
		
		easystar.setIterationsPerCalculation(1000);
		easystar.calculate();	
		this.remained_target_point.shift();	//Remove first point
		
		for(i = 0; i<path.length-1; i++)
		{
			path_x = path[i+1].x - path[i].x;
			path_y = path[i+1].y - path[i].y; 

			if (path_x == 0) real_dir = (path_y == 1) ? 1 : 3;	//Calculate next direction
			else real_dir = (path_x == 1) ? 2 : 0;

			count = real_dir - current_dir;
			if(count < 0) count +=4; 

			for(j = 0; j< count; j++) this.remained_path.push(1);	// 1 means "rotate"
			this.remained_path.push(2);	// 2 means 'move'

			current_dir = real_dir;
		}
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
