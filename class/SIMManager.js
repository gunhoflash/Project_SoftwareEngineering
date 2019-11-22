class SIMManager {

	/*
		Properties
	*/

	#robotMovement
	#hazardSensor
	#colorBlobSensor
	#positioningSensor

	constructor() {
		this.robotMovement     = new RobotMovement();
		this.hazardSensor      = new HazardSensor();
		this.colorBlobSensor   = new ColorBlobSensor();
		this.positioningSensor = new PositioningSensor();
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
	moveOrRotate(type) {
		switch (type) {
			case 'move'   : return this.robotMovement.move();
			case 'rotate' : return this.robotMovement.rotate();
			default: throw Error(`Unexpected type: ${type}`);
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
			default: throw Error(`Unexpected type: ${type}`);
		}
	}

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			Promise
	*/
	readDirection() {
		return this.robotMovement.getDirection();
	}
}