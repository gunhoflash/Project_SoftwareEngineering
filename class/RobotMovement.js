class RobotMovement {

	/*
		Properties
	*/

	#direction; // 0: north, 90: east, 180: south, 270: west

	constructor() {
		// TODO: edit it
		this.direction = 0; // initial direction: north
	}

	/*
		Methods
	*/

	/*
		Called by SIMManager.
		Rotate only 90degree clockwise.

		parameter:
			(none)

		return:
			Promise
	*/
	rotate() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				this.direction = (this.direction + 90) % 360;
				resolve();
			}, 1000);
		});
	}

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			Promise
	*/
	move() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			Promise
	*/
	getDirection() {
		return this.direction;
	}
}