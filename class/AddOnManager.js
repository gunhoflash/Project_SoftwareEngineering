class AddOnManager {

	/*
		Properties
	*/

	#map;
	#path;
	#userInterface;
	#simManager;
	#status;

	constructor(userInterface) {
		this.map = new Map();
		this.path = new Path();
		this.userInterface = userInterface;
		this.simManager = new SIMManager(this.map);
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
		console.log(`Start Robot Simulation`);
		this.status = true;

		// make initial path
		this.path.initPoint(this.map.getStartPoint(), this.map.getTargets());
		this.path.calculatePath(this.map, this.simManager.getPosition(), this.simManager.getDirection());

		while (this.status) {
			let currentPosition = this.simManager.getPosition();
			let nextPosition = this.simManager.getPosition(true);
			let currentDirection = this.simManager.getDirection();
			let needNewPath = false;

			this.userInterface.updatePosition(currentPosition);
			this.userInterface.updateDirection(currentDirection);
			this.userInterface.updateMapInfo(this.map.getMapInfo());

			// requests to read sensor and wait
			let hazard, colorBlob, positioning;
			let hazardPromise      = this.simManager.readSensor('hazard', nextPosition);       // 1 bit
			let colorBlobPromise   = this.simManager.readSensor('colorBlob', currentPosition); // 4 bit
			let positioningPromise = this.simManager.readSensor('positioning');                // 1 bit

			// wait
			hazardPromise.then(data => { console.log(data); hazard = data; });
			colorBlobPromise.then(data => { console.log(data); colorBlob = data; });
			positioningPromise.then(data => { console.log(data); positioning = data; });
			await hazardPromise;
			await colorBlobPromise;
			await positioningPromise;

			// handle exception: stop simulation while reading sensors
			if (!this.status) break;

			// read all sensors
			console.log(`read all sensors ${hazard}, ${colorBlob}, ${positioning}`);

			// hazard found
			if (hazard) {
				this.map.setHazard(nextPosition[0], nextPosition[1]);
				needNewPath = true;
			}

			// colorBlobs found
			if (colorBlob & 0b1000) {
				this.map.setColorBlob(currentPosition[0] - 1, currentPosition[1]);
			}
			if (colorBlob & 0b0100) {
				this.map.setColorBlob(currentPosition[0] + 1, currentPosition[1]);
			}
			if (colorBlob & 0b0010) {
				this.map.setColorBlob(currentPosition[0], currentPosition[1] - 1);
			}
			if (colorBlob & 0b0001) {
				this.map.setColorBlob(currentPosition[0], currentPosition[1] + 1);
			}

			// adjust position
			// TODO: handle excecption: robot run out from the map
			if (positioning) {
				this.simManager.setPosition();
				currentPosition = this.simManager.getPosition();
				needNewPath = true;
			}

			// check if current position is on target
			if (this.map.isTarget(currentPosition[0], currentPosition[1])) {
				this.map.setTargetVisited(currentPosition[0], currentPosition[1]);
				needNewPath = true;
			}

			// calculate new path
			if (needNewPath) {
				console.log(`re-calculate path`);
				this.path.initPoint(currentPosition, this.map.getTargets());
				this.path.calculatePath(this.map, currentPosition, currentDirection);
			}
			
			// check whether the path is remained or not
			let nextCommand = this.path.getNextCommand();
			console.log(`next command is ${nextCommand}, remained path is ${this.path.getPath()}`);
			if (nextCommand != null) {
				// move or rotate
				console.log(`Do the next command:${nextCommand}`);
				await this.simManager.driveMotor(nextCommand);
			} else {
				// if the path is empty, end
				if (this.map.getTargets().length > 0) {
					alert(`목표를 달성할 수 없습니다!`);
					console.log(`목표를 달성할 수 없습니다!`);
					break;
				} else {
					alert(`목표를 달성했습니다!`);
					console.log(`목표를 달성했습니다!`);
					break;
				}
			}
			
			this.userInterface.updatePosition(currentPosition);
			this.userInterface.updateDirection(currentDirection);
			this.userInterface.updateMapInfo(this.map.getMapInfo());

		}

		console.log(`End Robot Simulation`);
		this.stopRobotSimulation();
	}

	stopRobotSimulation() {
		this.status = false;
	}
}