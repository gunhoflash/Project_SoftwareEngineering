class UserInterface {

	/*
		Properties

		// Values
		private map_width
		private map_height
		private map_info
		private pointing_mode
		
		// ADD-ON
		private addonManager

		// UI components
		private svg_map
		private input_width
		private input_height
		private button_init
		private button_start
		private button_stop
		private button_change_pointing_mode
	*/

	/*
		Called by this.getUserInterface().
		Set all UI components to UserInterface's properties.
		Contructor should be private for singleton pattern.
	*/
	constructor() {}

	/*
		called by default.
		For singleton pattern.
	*/
	getUserInterface() {}

	/*
		Called by this.constructor().
		Set all UI components to UserInterface's properties.
	*/
	registerUIComponent() {}

	/*
		Called by click trigger.
		Set the harzard/target/start/end points.
	*/
	setPoint() {}

	/*
		Called by click trigger.
		Change pointing mode; i.e. harzard/target/start/end/none
	*/
	changePointingMode() {}

	/*
		Called by click trigger.
		Stop searching.
		Remove all points.
		Get the map size from <input> components.
	*/
	initMap() {}

	/*
		Called by click trigger.
		Start searching route and visualizing the simulation.
	*/
	startSearching() {}

	/*
		Called by click trigger or this.initMap().
		Stop searching route and visualizing the simulation.
	*/
	stopSearching() {}

	/*
	*/
	updateMap() {}
}