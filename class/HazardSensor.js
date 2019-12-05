class HazardSensor extends Sensor {

	/*

		Properties

	*/

	#map;

	constructor(map) {
		super();
		this.map = map;
	}

	/*

		Methods

	*/

	/*
		Return 1 bit data that indicates the existence of a hazard.
			0: not exist
			1: exist
	*/
	getSensorValue(position) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.map.isHazard(position[0], position[1]) ? 0b1 : 0b0);
			}, 300);
		});
	}
}