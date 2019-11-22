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
		Called by SIMManager.
		For singleton pattern.
	*/
	getSensorValue() {}
}