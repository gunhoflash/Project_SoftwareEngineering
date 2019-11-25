// TODO: handle exceptions
class UserInterface {

	/*
		Properties
	*/

	// static property
	static #ui;

	// variables
	#status;           // 'init', 'stop', 'start'
	#pointing_mode;    // ['default', 'target', 'harzard', 'start', 'end']
	#map_width;
	#map_height;
	#map_info;

	// ADD-ON
	#addonManager;

	// UI components
	#svg_map;
	#svg_rects;        // [rect, ...];
	#input_width;
	#input_height;
	#button_init;
	#button_mode;
	#button_start_stop;

	/*
		Called by this.getUserInterface().
		Set all UI components to UserInterface's properties.
		Contructor should be private for singleton pattern.
	*/
	constructor() {
		// TODO: edit something
		// TODO: init variables
		this.status = 'init';
		this.pointing_mode = ['default', 'target', 'hazard', 'start', 'end'];
		
		this.addonManager = new AddOnManager(this);
	}

	/*
		Methods
	*/

	/*
		called by default.
		For singleton pattern.
	*/
	static getUserInterface() {
		if (!UserInterface.ui)
			UserInterface.ui = new UserInterface();
		return UserInterface.ui;
	}

	/*
		Called by default().
		Set all UI components to UserInterface's properties.
	*/
	registerUIComponents(array) {
		for (let component of array) {
			switch (component.type) {
				case "svg_map":
					this.svg_map = component.target;
					this.svg_map.addEventListener('mousedown', this.setPoint.bind(this));
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
				case "button_mode":
					this.button_mode = component.target;
					this.button_mode.addEventListener('click', this.changePointingMode.bind(this));
					break;
				case "button_start_stop":
					this.button_start_stop = component.target;
					this.button_start_stop.addEventListener('click', this.startStopSearching.bind(this));
					break;
				default:
					break;
			}
		}
	}

	/*
		Called by ADD-ON.
		Update tile info from ADD-OD data
	*/
	updateTile(row, column, type) {
		this.svg_rects[row][column].dataset.type = type;
	}

	updateSIMPosition(row, column) {
		console.log(`SIM: ${row}, ${column}`);
	}

	/*
		Called by click trigger.
		Set the harzard/target/start/end points.
	*/
	setPoint(event) {
		// handle exception: no rect
		if (!this.svg_rects) return;

		// set the rect's type
		let type = this.pointing_mode[0];
		if (event.target.dataset.type == type) {
			event.target.dataset.type = 'default';
			return;
		}

		/*
			If the selected type is 'start' or 'end'
			and there is already a tile with same type,
			change that tile's type to 'default'
		*/
		if (type == 'start' || type == 'end') {
			for (let rect of this.svg_rects.flat()) {
				if (rect.dataset.type == type) {
					rect.dataset.type = 'default';
					break;
				}
			}
		}
		event.target.dataset.type = type;
	}

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

		// set size(width/height) of the map component
		this.svg_map.style.width = this.map_width * 30;
		this.svg_map.style.height = this.map_height * 30;
		
		// initialize all tiles
		this.initTiles();
	}

	/*
		Called by click trigger.
		Start or stop searching.
	*/
	startStopSearching() {
		// TODO: edit it
		if (this.status == 'start') {
			// when 'start' status, stop searching
			this.stopSearching();
		} else if (this.status == 'stop') {
			// when 'stop' status, start searching
			this.startSearching();
		} else {
			// when 'init' status, do nothing
		}
	}

	/*
		Called by this.startStopSearching()
		Start searching route and visualizing the simulation.
	*/
	startSearching() {
		// TODO: edit it
		this.status = 'start';
		this.button_start_stop.innerHTML = 'Stop';
		this.button_start_stop.disabled = false;
		this.button_mode.disabled = true;

		// set map_info for ADD-ON
		let map_info = [];
		for (var row of this.svg_rects)
		{
			map_info.push([]);
			for (var rect of row)
			{
				map_info.push(rect.dataset.type);
			}
		}

		// Send start signal to ADD-ON with map data
		this.addonManager.init(map_info);
	}
	
	/*
		Called by click trigger or this.initMap().
		Stop searching route and visualizing the simulation.
	*/
	stopSearching() {
		// TODO: edit it
		this.status = 'stop';
		this.button_start_stop.innerHTML = 'Start';
		this.button_start_stop.disabled = false;
		this.button_mode.disabled = false;
		// TODO: send stop signal to ADD-ON
	}

	
	/*
		Called by click trigger.
		Change pointing mode; i.e. harzard/target/start/end/none
	*/
	changePointingMode() {
		this.pointing_mode.push(this.pointing_mode.shift());
		this.button_mode.innerHTML = this.pointing_mode[0];
	}


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

		// create new tiles and put them into this.svg_rects
		for (i = 0; i < this.map_height; i++) {
			this.svg_rects.push([]);
			for (j = 0; j < this.map_width; j++) {
				tile = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				tile.setAttribute('class', 'tile');
				tile.setAttribute('x', j * 30);
				tile.setAttribute('y', i * 30);
				tile.dataset.type = 'default';
				this.svg_map.appendChild(tile);
				this.svg_rects[i].push(tile);
			}
		}
	}
}