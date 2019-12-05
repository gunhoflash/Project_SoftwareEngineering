class UserInterface {

	/*

		Properties

	*/

	// static property
	static #ui;

	// variables
	#status;           // 'init', 'stop', 'start'
	#pointing_mode;    // ['default', 'target', 'harzard', 'start']
	#map_width;
	#map_height;
	#map_info;

	// ADD-ON
	#addon_manager;

	// UI components
	#svg_map;
	#svg_rects;        // [rect, ...];
	#svg_robot;
	#svg_robot_body;
	#input_width;
	#input_height;
	#button_init;
	#button_mode;
	#button_start_stop;

	/*
		Set all UI components to UserInterface's properties.
		Contructor should be private for singleton pattern.
	*/
	constructor() {
		this.status = 'init';
		this.pointing_mode = [
			Map.tile_type.default,
			Map.tile_type.target,
			Map.tile_type.hazard,
			Map.tile_type.start
		];
		
		this.addon_manager = new AddOnManager(this);
	}

	/*

		Methods

	*/

	/*
		Return the UserInterface object.
		Implemented for singleton pattern.
	*/
	static getUserInterface() {
		if (!UserInterface.ui)
			UserInterface.ui = new UserInterface();
		return UserInterface.ui;
	}

	/*
		Register all UI components to UserInterface's properties.
		Add event listener for tiles and buttons.
	*/
	registerUIComponents(array) {
		for (let component of array) {
			switch (component.type) {
				case "svg_map":
					this.svg_map = component.target;
					this.svg_map.addEventListener('mousedown', this.#setPoint.bind(this));
					break;
				case "svg_robot":
					this.svg_robot = component.target;
					break;
				case "svg_robot_body":
					this.svg_robot_body = component.target;
					break;
				case "input_width":
					this.input_width = component.target;
					break;
				case "input_height":
					this.input_height = component.target;
					break;
				case "button_init":
					this.button_init = component.target;
					this.button_init.addEventListener('click', this.#initMap.bind(this));
					break;
				case "button_mode":
					this.button_mode = component.target;
					this.button_mode.addEventListener('click', this.#changePointingMode.bind(this));
					break;
				case "button_start_stop":
					this.button_start_stop = component.target;
					this.button_start_stop.addEventListener('click', this.#controlRobotSimulation.bind(this));
					break;
				default:
					break;
			}
		}
	}

	/*
		Update tile's type.
	*/
	#updateTile = (row, column, type) => {
		this.svg_rects[row][column].dataset.type = type;
	}

	/*
		Change type of the tile which is selected by the user.
	*/
	#setPoint = (event) => {
		// handle exception: no rect
		if (!this.svg_rects) return;

		// set the rect's type
		let type = this.pointing_mode[0];
		if (event.target.dataset.type == type) {
			event.target.dataset.type = Map.tile_type.default;
			return;
		}

		/*
			If the selected type is 'start',
			change the type of start tile that already exists to default.
		*/
		if (type == Map.tile_type.start) {
			for (let rect of this.svg_rects.flat()) {
				if (rect.dataset.type == type) {
					rect.dataset.type = Map.tile_type.default;
					break;
				}
			}
		}

		// set type of the selected tile
		event.target.dataset.type = type;
	}

	/*
		Get the map size from <input> components.
		Request map initialization to ADD-ON.
	*/
	#initMap = () => {
		this.#stopRobotSimulation();

		// set size
		this.map_width = parseInt(this.input_width.value);
		this.map_height = parseInt(this.input_height.value);

		// set size(width/height) of the map component
		this.svg_map.style.width = this.map_width * 30;
		this.svg_map.style.height = this.map_height * 30;
		
		// initialize all tiles
		this.#initTiles();
	}

	/*
		Start or stop searching.
	*/
	#controlRobotSimulation = () => {
		if (this.status == 'start') this.#stopRobotSimulation();
		else if (this.status == 'stop') this.#startRobotSimulation();
	}

	/*
		Request begining robot simulation to ADD-ON.
		Send map information to ADD-ON to initialize.
	*/
	#startRobotSimulation = () => {
		this.status                      = 'start';
		this.button_start_stop.innerHTML = 'Stop';
		this.button_start_stop.disabled  = false;
		this.button_mode.disabled        = true;

		// set map_info for ADD-ON
		let i, j, map_info = [];
		for (i = 0; i < this.svg_rects.length; i++) {
			map_info.push([]);
			for (j = 0; j < this.svg_rects[i].length; j++) {
				map_info[i].push(this.svg_rects[i][j].dataset.type);
			}
		}

		// Send start signal to ADD-ON with map data
		this.addon_manager.init(map_info, this.map_width, this.map_height);
		this.addon_manager.startRobotSimulation();

		// reset robot's rotation to 0
		this.svg_robot_body.setAttribute('data-rotation', '0');
		this.svg_robot_body.style.transform = `rotate(0deg)`;
	}

	/*
		Request suspend robot simulation to ADD-ON.
	*/
	#stopRobotSimulation = () => {
		this.status                      = 'stop';
		this.button_start_stop.innerHTML = 'Start';
		this.button_start_stop.disabled  = false;
		this.button_mode.disabled        = false;
		this.addon_manager.stopRobotSimulation();
	}

	/*
		Change pointing mode: default/harzard/target/start.
	*/
	#changePointingMode = () => {
		this.pointing_mode.push(this.pointing_mode.shift());
		this.button_mode.innerHTML = Object.keys(Map.tile_type).find(key => Map.tile_type[key] == this.pointing_mode[0]);
	}

	/*
		Initialize all tiles.
	*/
	#initTiles = () => {
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
				tile.dataset.type = Map.tile_type.default;
				this.svg_map.prepend(tile);
				this.svg_rects[i].push(tile);
			}
		}
	}

	/*
		Show updated robot's position.
	*/
	updatePosition(position) {
		this.svg_robot.setAttribute('x', position[1] * 30);
		this.svg_robot.setAttribute('y', position[0] * 30);
	}

	/*
		Show updated robot's direction
	*/
	updateDirection(direction) {
		let current_rotation, next_rotation;

		current_rotation = parseInt(this.svg_robot_body.getAttribute('data-rotation'));

		// do nothing when same direction
		if ((current_rotation % 360) / 90 == direction) return;

		next_rotation = parseInt((current_rotation + 90) / 360) * 360 + direction * 90;

		// set robot's rotation
		this.svg_robot_body.setAttribute('data-rotation', next_rotation);
		this.svg_robot_body.style.transform = `rotate(${next_rotation}deg)`;
	}

	/*
		Show updated map information.
	*/
	updateMapInfo(map_info) {
		let i, j;
		for (i = 0; i < this.map_height; i++) {
			for (j = 0; j < this.map_width; j++) {
				this.#updateTile(i, j, map_info[i][j]);
			}
		}
	}
}