class HazardSensor extends Sensor {

	#map;

	constructor(map) {
		super();
		this.map = map;
	}

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
	getSensorValue(position) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.map.isHazard(position[0], position[1]) ? 0b1 : 0b0);
			}, 500);
		});
	}
}