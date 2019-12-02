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
	getSensorValue(position) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this.map.isHazard(position[0], position[1]) ? 0b1 : 0b0);
			}, 300);
		});
	}
}