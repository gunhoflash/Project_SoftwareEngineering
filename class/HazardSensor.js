class HazardSensor extends Sensor {

	constructor() {}

	/*
		Methods
	*/

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			1 bit: indicates the existence of a hazard.
	*/
	// ISSUE: handle exception: single tile can be both of colorblob and hazard
	// ISSUE: need to check the tile where SIM located since of 2-tile-moving error.
	getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(Math.random() > 0.1 ? 0b0 : 0b1);
			}, 1000);
		});
	}
}