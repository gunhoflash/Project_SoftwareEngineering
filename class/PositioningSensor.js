class PositioningSensor extends Sensor {

	/*
		Properties
	*/

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			1 bit: indicates whether the SIM moved 2 tiles or not.
	*/
	static getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(Math.random() > 0.1 ? 0b0 : 0b1);
			}, 1000);
		});
	}
}