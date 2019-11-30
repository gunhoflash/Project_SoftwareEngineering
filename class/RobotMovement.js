class RobotMovement {

	/*
		Properties
	*/

	/*
		Methods
	*/

	/*
		Called by SIMManager.

		parameter:
			(none)

		return:
			Promise
	*/
	rotate() {
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
	move() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}
}