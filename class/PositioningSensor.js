class PositioningSensor extends Sensor {

	/*

		Methods

	*/

	/*
		Return 1 bit data that indicates whether the SIM moved 2 tiles or not.
			0: no error
			1: error(moved 2 tiles)
	*/
	getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(Math.random() > 0.07 ? 0b0 : 0b1);
			}, 200);
		});
	}
}