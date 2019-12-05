class AddOnManager {

	/*

		Properties

	*/

	#map;
	#path;
	#user_interface;
	#sim_manager;
	#status;

	constructor(user_interface) {
		this.map            = new Map();
		this.path           = new Path();
		this.user_interface = user_interface;
		this.sim_manager    = new SIMManager(this.map);
		this.status         = false;
	}

	/*

		Methods

	*/

	/*
		Initialize ADD-ON.
	*/
	init(map_info, map_width, map_height) {
		this.status = false;

		// initialize map
		this.map.init(map_info, map_width, map_height);
		this.sim_manager.setPosition(this.map.getStartPoint());
		this.sim_manager.setDirection(SIMManager.direction_type.north);
	}

	/*
		Send the position and direction of the robot
		and map information to the user interface to display.
	*/
	updateUI() {
		if (!this.user_interface || !this.sim_manager) return;
		this.user_interface.updatePosition(this.sim_manager.getPosition());
		this.user_interface.updateDirection(this.sim_manager.getDirection());
		this.user_interface.updateMapInfo(this.map.getMapInfo());
	}

	/*
		Start the robot simulation.
		Read sensor data and calculate the path.
	*/
	async startRobotSimulation() {
		this.status = true;

		// send initial data to the user interface
		this.updateUI();

		// make initial path
		this.path.calculatePath(this.map, this.sim_manager.getPosition(), this.sim_manager.getDirection());

		while (this.status) {
			let currentPosition, nextPosition, currentDirection,
				positioning, hazard, colorBlob,
				positioningPromise, hazardPromise, colorBlobPromise,
				needNewPath;

			needNewPath = false;

			/*

				Read Positioning Sensor

			*/

			// requests to read positioning sensor and wait
			positioningPromise = this.sim_manager.readSensor('positioning');
			positioningPromise.then(data => { positioning = data; });
			await positioningPromise;

			// adjust position
			if (positioning) {
				this.sim_manager.setPosition();
				needNewPath = true;
			}
			currentPosition = this.sim_manager.getPosition();

			// update ui
			this.updateUI();

			// end if the robot is out of the map
			if (!this.map.isValidPosition(currentPosition)) {
				alert(`The positioning sensor detected that the robot is out of the map!`);
				console.log(`The positioning sensor detected that the robot is out of the map!`);
				break;
			}

			// get current position and direction
			nextPosition     = this.sim_manager.getPosition(true);
			currentPosition  = this.sim_manager.getPosition();
			currentDirection = this.sim_manager.getDirection();

			/*

				Read Hazard/ColorBlob Sensor

			*/

			// requests to read positioning sensor and wait
			hazardPromise    = this.sim_manager.readSensor('hazard', nextPosition);
			colorBlobPromise = this.sim_manager.readSensor('colorBlob', currentPosition);
			hazardPromise.then(data => { hazard = data; });
			colorBlobPromise.then(data => { colorBlob = data; });
			await hazardPromise;
			await colorBlobPromise;

			// hazard found
			if (hazard) {
				this.map.setHazard(nextPosition[0], nextPosition[1]);
				needNewPath = true;
			}

			// colorBlobs found
			if (colorBlob & 0b1000) this.map.setColorBlob(currentPosition[0] - 1, currentPosition[1]);
			if (colorBlob & 0b0100) this.map.setColorBlob(currentPosition[0] + 1, currentPosition[1]);
			if (colorBlob & 0b0010) this.map.setColorBlob(currentPosition[0], currentPosition[1] - 1);
			if (colorBlob & 0b0001) this.map.setColorBlob(currentPosition[0], currentPosition[1] + 1);

			// update ui
			this.updateUI();

			/*

				Calculate Path

			*/

			// check if current position is on target
			if (this.map.isTarget(currentPosition[0], currentPosition[1])) {
				this.map.setTargetVisited(currentPosition[0], currentPosition[1]);
				needNewPath = true;
				this.updateUI();
			}

			// calculate a new path
			if (needNewPath)
				this.path.calculatePath(this.map, currentPosition, currentDirection);

			/*

				Order Robot or END

			*/

			// draw next command
			let nextCommand = this.path.getNextCommand();
			if (nextCommand != null) {
				// order robot to move or rotate
				await this.sim_manager.driveMotor(nextCommand);
			} else {
				// if there is no command left, end this simulation
				if (this.map.getTargets().length > 0) {
					alert(`Cannot make a path!`);
				} else {
					alert(`Ended successfully`);
				}
				break;
			}

			// update ui
			this.updateUI();
		}

		this.stopRobotSimulation();
	}

	/*
		End the robot simulation.
	*/
	stopRobotSimulation() {
		this.status = false;
	}
}