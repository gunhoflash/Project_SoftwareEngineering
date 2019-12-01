class ColorBlobSensor extends Sensor {

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
			4 bit: each bit indicates the existence of a colorblob.
	*/
	getSensorValue(position) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let row    = position[0];
				let column = position[1];
				let d      = 0b0000;
				d |= this.map.isColorBlob(row - 1, column) ? 0b1000 : 0b0000; // top
				d |= this.map.isColorBlob(row + 1, column) ? 0b0100 : 0b0000; // bottom
				d |= this.map.isColorBlob(row, column - 1) ? 0b0010 : 0b0000; // left
				d |= this.map.isColorBlob(row, column + 1) ? 0b0001 : 0b0000; // right
				resolve(d);
			}, 500);
		});
	}
}