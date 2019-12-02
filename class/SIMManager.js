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
		Called by SIMManager.

		parameter:
			type: string that indicates a method to call

		return:
			Promise
	*/
	driveMotor(type) {
		if (type == SIMManager.drive_type.move) {
			return this.robot_movement.move().then(this.setPosition.bind(this));
		} else if (type == SIMManager.drive_type.rotate) {
			return this.robot_movement.rotate().then(() => {
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
					default: throw Error(`Unexpected direction: ${this.current_direction}`);
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
			case 'hazard'      : return this.hazard_sensor.getSensorValue(position);
			case 'colorBlob'   : return this.color_blob_sensor.getSensorValue(position);
			case 'positioning' : return this.positioning_sensor.getSensorValue();
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
		return this.current_direction;
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
		Called by ADD-ON.

		parameter:
			(none)

		return:
			(none)
	*/
	setDirection(direction) {
		this.current_direction = direction;
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
			this.current_position = position;
		} else {
			// move forward
			let nextPosition = this.getPosition(true);
			this.current_position = nextPosition;
		}
	}
}