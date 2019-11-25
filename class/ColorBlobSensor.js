class ColorBlobSensor extends Sensor {

	/*
		Methods
	*/

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			4 bit: each bit indicates the existence of a colorblob.
	*/
	// ISSUE: handle exception: single tile can be both of colorblob and hazard
	getSensorValue() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let d = 0b0000;
				d |= (Math.random() > 0.1) ? 0b0000 : 0b1000; // top
				d |= (Math.random() > 0.1) ? 0b0000 : 0b0100; // bottom
				d |= (Math.random() > 0.1) ? 0b0000 : 0b0010; // left
				d |= (Math.random() > 0.1) ? 0b0000 : 0b0001; // right
				resolve(d);
			}, 1000);
		});
	}
}