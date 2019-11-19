// TODO: handle exceptions
class UserInterface {

	/*
		Properties
	*/

	// static property
	static #ui     = null;

	// variables
	#map_width     = 0;
	#map_height    = 0;
	#pointing_mode = 'default';

	// ADD-ON
	// #addonManager

	// UI components
	#svg_map       = null;
	#svg_rects     = null;
	#input_width   = null;
	#input_height  = null;
	#button_init   = null;
	#button_start  = null;
	#button_stop   = null;
	#button_mode   = null;

	/*
		Called by this.getUserInterface().
		Set all UI components to UserInterface's properties.
		Contructor should be private for singleton pattern.
	*/
	constructor() {
		// TODO: edit something
		// TODO: init variables
	}

	/*
		called by default.
		For singleton pattern.
	*/
	static getUserInterface() {
		if (UserInterface.ui == null) {
			UserInterface.ui = new UserInterface();
		}
		return UserInterface.ui;
	}

	/*
		Called by default().
		Set all UI components to UserInterface's properties.
	*/
	registerUIComponents(array) {
		for (let component of array) {
			console.log(component);
			switch (component.type) {
				case "svg_map":
					this.svg_map = component.target;
					break;
				case "input_width":
					this.input_width = component.target;
					break;
				case "input_height":
					this.input_height = component.target;
					break;
				case "button_init":
					this.button_init = component.target;
					this.button_init.addEventListener('click', this.initMap.bind(this));
					break;
				case "button_start":
					this.button_start = component.target;
					this.button_init.addEventListener('click', this.startSearching.bind(this));
					break;
				case "button_stop":
					this.button_stop = component.target;
					this.button_init.addEventListener('click', this.stopSearching.bind(this));
					break;
				case "button_mode":
					this.button_mode = component.target;
					this.button_init.addEventListener('click', this.changePointingMode.bind(this));
					break;
				default:
					break;
			}
		}
		return this;
	}

	/*
	*/
	updateMap() {}

	/*
		Called by click trigger.
		Set the harzard/target/start/end points.
	*/
	setPoint() {}

	/*
		Called by click trigger.
		Stop searching.
		Remove all points.
		Get the map size from <input> components.
	*/
	initMap() {
		// TODO: edit it
		this.stopSearching();

		// set size
		this.map_width = parseInt(this.input_width.value);
		this.map_height = parseInt(this.input_height.value);
		
		// initialize all tiles
		this.initTiles();

		// TODO: delete exist tiles
		// TODO: create new tiles
	}

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
		Called by click trigger.
		Change pointing mode; i.e. harzard/target/start/end/none
	*/
	changePointingMode() {}


	/*
		Initialize all tiles
	*/
	initTiles() {
		let i, j, tile;

		// remove all tiles
		if (this.svg_rects) {
			for (i = 0; i < this.svg_rects.length; i++) {
				for (j = 0; j < this.svg_rects[i].length; j++) {
					this.svg_rects[i][j].remove();
				}
			}
		}
		this.svg_rects = [];

		// create new tiles
		for (i = 0; i < this.map_height; i++) {
			this.svg_rects.push([]);
			for (j = 0; j < this.map_width; j++) {
				tile = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				tile.setAttribute('class', 'tile');
				tile.setAttribute('x', j * 30);
				tile.setAttribute('y', i * 30);
				this.svg_map.appendChild(tile);
				this.svg_rects[i].push(tile);
			}
		}

		// set size of the map component
		this.svg_map.style.width = this.map_width * 30;
		this.svg_map.style.height = this.map_height * 30;
	}
}