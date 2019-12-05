class Sensor {

	constructor() {
		if (new.target == Sensor) {
			throw Error(`Cannot instantiate the type ${new.target.name}`);
		}
	}

	/*

		Methods

	*/

	/*
		Return n bits sensor data
	*/
	getSensorValue(position = null) {}
}