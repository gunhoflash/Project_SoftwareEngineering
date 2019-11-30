class AddOnManager {

	/*
		Properties
	*/

	#userInterface;
	#simManager;
	#map;
	#path;
	#status;

	constructor(userInterface) {
		this.userInterface = userInterface;
		this.simManager = new SIMManager();
		this.map = new Map();
		this.path = new Path();
		this.status = false;
	}

	/*
		Methods
	*/

	/*
		Called by SIMManager.
	*/
	init(map_info, map_width, map_height) {
		console.log(`AddOnManager init`);

		this.status = false;

		// initialize map
		this.map.init(map_info, map_width, map_height);
		this.simManager.setPosition(this.map.getStartPoint());
		this.simManager.setDirection(SIMManager.direction_type.north);
	}

	async startRobotSimulation() {
		let i = 0;
		console.log(`Start Robot Simulation`);
		this.status = true;
		while (this.status) {
			console.log(`${i++}`);
			this.userInterface.updatePosition(this.simManager.getPosition());
			this.userInterface.updateDirection(this.simManager.getDirection());
			this.userInterface.updateMapInfo(this.map.getMapInfo());

			// requests to read sensor and wait
			let hazard      = this.simManager.readSensor('hazard');      // 1 bit
			let colorBlob   = this.simManager.readSensor('colorBlob');   // 4 bit
			let positioning = this.simManager.readSensor('positioning'); // 1 bit

			// wait
			await hazard;
			await colorBlob;
			await positioning;

			// handle exception: stop simulation while reading sensors
			if (!this.status) break;

			// read all sensors
			// TODO: do something
			console.log(`read all sensors ${hazard}, ${colorBlob}, ${positioning}`);

			// TODO: Path.calculatePath()
			// TODO: check whether the path is remained or not
			// TODO: if the path is empty, end
			// TODO: move or rotate
		}

		console.log(`End Robot Simulation`);
	}

	stopRobotSimulation() {
		this.status = false;
	}
}