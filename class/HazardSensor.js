class HazardSensor extends Sensor {

	/*
		Properties
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
	static getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(Math.random() > 0.1 ? 0b0 : 0b1);
			}, 1000);
		});
	}
}