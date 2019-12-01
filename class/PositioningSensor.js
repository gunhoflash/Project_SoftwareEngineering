class PositioningSensor extends Sensor {

	/*
		Methods
	*/

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			1 bit: indicates whether the SIM moved 2 tiles or not.
	*/
	getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(0b0);
				// resolve(Math.random() > 0.1 ? 0b0 : 0b1);
			}, 500);
		});
	}
}