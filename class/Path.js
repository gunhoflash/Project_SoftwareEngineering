class Path {

	/*
		Properties

		private start_point
		private end_point
		private entire_target_point[]
		private remained_target_point[]

		private path

	*/

	/*
		Called by AddOnManager.
	*/
	public initPoint(start, end, target[]) {}

	/*
		Called by AddOnManager.
	*/
	public calculatePath(Map, currentPosition) {}
	
	/*
		Called by AddOnManager.
	*/
	// return 0: remained, -1: fail, 1: success
	public getState() {}

	/*
		Called by AddOnManager.
	*/
	public getPath() {}

}