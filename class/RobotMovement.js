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
			}, 600);
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