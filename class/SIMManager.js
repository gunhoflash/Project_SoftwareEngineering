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

	#robotMovement;
	#hazardSensor;
	#colorBlobSensor;
	#positioningSensor;
	
	#currentPosition;
	#currentDirection;

	constructor() {
		this.robotMovement     = new RobotMovement();
		this.hazardSensor      = new HazardSensor();
		this.colorBlobSensor   = new ColorBlobSensor();
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
		if (type == 'move') {
			return this.robotMovement.move().then(setPosition);
		} else if (type == 'rotate') {
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
	readSensor(type) {
		switch (type) {
			case 'hazard'      : return this.hazardSensor.getSensorValue();
			case 'colorBlob'   : return this.colorBlobSensor.getSensorValue();
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
	getPosition() {
		return this.currentPosition;
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
			switch (this.getDirection()) {
				case SIMManager.direction_type.north : this.currentPosition[0]--; break;
				case SIMManager.direction_type.east  : this.currentPosition[1]++; break;
				case SIMManager.direction_type.south : this.currentPosition[0]++; break;
				case SIMManager.direction_type.west  : this.currentPosition[1]--; break;
				default : throw Error(`Unexpected direction: ${this.currentDirection}`);
			}
		}
	}
}