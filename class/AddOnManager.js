class AddOnManager {

	/*
		Properties
	*/

	#userInterface;
	#simManager;
	#map;
	#path;

	constructor(userInterface) {
		this.userInterface = userInterface;
		this.simManager = new SIMManager();
		this.map = new Map();
		this.path = new Path();
	}

	/*
		Methods
	*/

	/*
		Called by SIMManager.
	*/
	init(map_info) {
		console.log(`AddOnManager init`);
	}

	startRobotSimulation() {
		// UI.updateMap
		// SM.readSensor()
		// Path.calculatePath()
		// end or SM.moveOrRotate()
	}

}