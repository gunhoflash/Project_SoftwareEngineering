class SIMManager {

	/*

		Properties

	*/

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

	#robot_movement;
	#hazard_sensor;
	#color_blob_sensor;
	#positioning_sensor;
	#current_position;
	#current_direction;

	constructor(map) {
		this.robot_movement     = new RobotMovement();
		this.hazard_sensor      = new HazardSensor(map);
		this.color_blob_sensor  = new ColorBlobSensor(map);
		this.positioning_sensor = new PositioningSensor();

		this.setPosition([0, 0]);
		this.setDirection(SIMManager.direction_type.north);
	}

	/*

		Methods

	*/

	/*
		Return a Promise object that fulfills
		the command(move or rotate).
	*/
	driveMotor(type) {
		if (type == SIMManager.drive_type.move) {
			return this.robot_movement.move().then(this.setPosition.bind(this));
		} else if (type == SIMManager.drive_type.rotate) {
			return this.robot_movement.rotate().then(() => {
				// rotate only 90 degree clockwise.
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
					default: throw Error(`Unexpected direction: ${this.current_direction}`);
				}
			});
		} else {
			throw Error(`Unexpected type: ${type}`);
		}
	}

	/*
		Return a Promise object that fulfills
		reading the robot's sensor data from given position.
	*/
	readSensor(type, position) {
		switch (type) {
			case 'hazard'      : return this.hazard_sensor.getSensorValue(position);
			case 'colorBlob'   : return this.color_blob_sensor.getSensorValue(position);
			case 'positioning' : return this.positioning_sensor.getSensorValue();
			default            : throw Error(`Unexpected type: ${type}`);
		}
	}

	/*
		Return the current direction.
	*/
	getDirection() {
		return this.current_direction;
	}

	/*
		Return the current position.
		If the parameter 'next' is true, return the forward position.
	*/
	getPosition(next = false) {
		if (next) {
			let nextPosition = this.current_position.slice();
			switch (this.getDirection()) {
				case SIMManager.direction_type.north : nextPosition[0]--; break;
				case SIMManager.direction_type.east  : nextPosition[1]++; break;
				case SIMManager.direction_type.south : nextPosition[0]++; break;
				case SIMManager.direction_type.west  : nextPosition[1]--; break;
				default : throw Error(`Unexpected direction: ${this.current_direction}`);
			}
			return nextPosition;
		} else return this.current_position;
	}

	/*
		Set current direction.
	*/
	setDirection(direction) {
		this.current_direction = direction;
	}

	/*
		Set the current position to
		forward position or specific position.
	*/
	setPosition(position = null) {
		if (position) {
			// set current position
			this.current_position = position;
		} else {
			// move forward
			let nextPosition = this.getPosition(true);
			this.current_position = nextPosition;
		}
	}
}