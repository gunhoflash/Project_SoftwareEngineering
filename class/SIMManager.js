class SIMManager {

	/*
		Properties
	*/

	// TODO: change direction to array(or vector)
	static direction_type = {
		north : 0,
		east  : 1,
		south : 2,
		west  : 3
	};

	static drive_type = {
		move   : 0,
		rotate : 1
	};

	#robotMovement;
	#hazardSensor;
	#colorBlobSensor;
	#positioningSensor;
	
	#currentPosition;
	#currentDirection;

	constructor(map) {
		this.robotMovement     = new RobotMovement();
		this.hazardSensor      = new HazardSensor(map);
		this.colorBlobSensor   = new ColorBlobSensor(map);
		this.positioningSensor = new PositioningSensor();

		this.setPosition([0, 0]);
		this.setDirection(SIMManager.direction_type.north);
	}

	/*
		Methods
	*/

	/*
		Called by SIMManager.

		parameter:
			type: string that indicates a method to call

		return:
			Promise
	*/
	driveMotor(type) {
		if (type == SIMManager.drive_type.move) {
			return this.robotMovement.move().then(this.setPosition.bind(this));
		} else if (type == SIMManager.drive_type.rotate) {
			return this.robotMovement.rotate().then(() => {
				// Rotate only 90 degree clockwise.
				switch (this.getDirection()) {
					case SIMManager.direction_type.north:
						this.setDirection(SIMManager.direction_type.east);
						break;
					case SIMManager.direction_type.east:
						this.setDirection(SIMManager.direction_type.south);
						break;
					case SIMManager.direction_type.south:
						this.setDirection(SIMManager.direction_type.west);
						break;
					case SIMManager.direction_type.west:
						this.setDirection(SIMManager.direction_type.north);
						break;
					default: throw Error(`Unexpected direction: ${this.currentDirection}`);
				}
			});
		} else {
			throw Error(`Unexpected type: ${type}`);
		}
	}

	/*
		Called by SIMManager.

		parameter:
			type: string that indicates a sensor to read

		return:
			Promise
	*/
	readSensor(type, position) {
		switch (type) {
			case 'hazard'      : return this.hazardSensor.getSensorValue(position);
			case 'colorBlob'   : return this.colorBlobSensor.getSensorValue(position);
			case 'positioning' : return this.positioningSensor.getSensorValue();
			default            : throw Error(`Unexpected type: ${type}`);
		}
	}

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			(none)
	*/
	getDirection() {
		return this.currentDirection;
	}

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			(none)
	*/
	getPosition(next = false) {
		if (next) {
			let nextPosition = this.currentPosition.slice();
			switch (this.getDirection()) {
				case SIMManager.direction_type.north : nextPosition[0]--; break;
				case SIMManager.direction_type.east  : nextPosition[1]++; break;
				case SIMManager.direction_type.south : nextPosition[0]++; break;
				case SIMManager.direction_type.west  : nextPosition[1]--; break;
				default : throw Error(`Unexpected direction: ${this.currentDirection}`);
			}
			return nextPosition;
		} else return this.currentPosition;
	}

	/*
		Called by ADD-ON.

		parameter:
			(none)

		return:
			(none)
	*/
	setDirection(direction) {
		this.currentDirection = direction;
	}

	/*
		Called by ADD-ON.
		Move 1 tile forward.

		parameter:
			position: If null, move 1 tile forward. If not, set current position

		return:
			(none)
	*/
	setPosition(position = null) {
		if (position) {
			// set current position
			this.currentPosition = position;
		} else {
			// move forward
			let nextPosition = this.getPosition(true);
			this.currentPosition = nextPosition;
		}
	}
}