class RobotMovement {

	/*

		Methods

	*/

	/*
		Rotate (clockwise) for 300ms.
	*/
	rotate() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 400);
		});
	}

	/*
		Move forward for 400ms.
	*/
	move() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 400);
		});
	}
}