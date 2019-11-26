import {Application} from 'pixi.js';

import {RGB2HEX} from './Helpers';
import Sprite from './Sprite';
import Texture from './Texture';
import Group from './Group';
import Input from './Input';
import Spritesheet from './Spritesheet';
import Graphics from './Graphics';
import Text from './Text';
import Camera from './Camera';
import Physics from './Physics';

/**
 * Rorke game instance
 *
 * @example
 * const game = new Rorke(800, 600, [0, 0, 0]);
 * game.start();
 *
 * async function load() {}
 * async function create() {}
 * async function update() {}
 *
 *
 * @param {Number} width canvas width
 * @param {Number} height canvas height
 * @param {Number[]} colour canvar colour
 */
export default class Rorke {
	constructor(width, height, colour) {
		this.width = width;
		this.height = height;
		this.colour = colour || [0, 0, 0];
		this.version = '1.0';
		this.fps = 60;
		this.input = new Input();
		this._graphics = [];
		this.graphics = new Graphics(this);

		this.pixi = {
			app: this.createApp(),
		};

		this.load = {
			texture: async (name, path) => {
				const newTexture = new Texture(name, path, this);
				await newTexture.load();
				this.textures.push(newTexture);
				return newTexture;
			},
			spritesheet: async (name, path, options) => {
				const newSpritesheet = new Spritesheet(name, path, options, this);
				await newSpritesheet.load((textures) => {
					this.spritesheets.push(newSpritesheet);
				});
			},
		};

		this.add = {
			sprite: async (x, y, textureName) => {
				const newSprite = new Sprite(x, y, textureName, this);
				await newSprite.add();
				this.sprites.push(newSprite);
				return newSprite;
			},
			group: async () => {
				const newGroup = new Group(this);
				await newGroup.add();
				this.groups.push(newGroup);
				return newGroup;
			},
			text: (x, y, text, options) => {
				const newText = new Text(x, y, text, options, this);
				newText.add();
				this.texts.push(newText);
				return newText;
			},
		};

		this.sprites = [];
		this.groups = [];

		this.textures = [];
		this.spritesheets = [];
		this.spritesheetsLoaded = 0;

		this.texts = [];
		this.camera = new Camera(this);
		this.cameraMoveBools = undefined;
		this.physics = new Physics(this);

		this.printInfo();
	}

	/**
	 * Prints a styled message to console saying rorke version and author
	 */
	printInfo() {
		const consoleStyles = `background: linear-gradient(#D33106, #571402);
              border: 1px solid #3E0E02;
              color: white;
              display: block;
              text-shadow: 0 1px 0 rgba(0.9, 0, 0, 1);
              box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset;
              line-height: 40px;
              text-align: center;
              font-weight: bold;
              `;
		console.log(`%c Rorke ${this.version}\n By: Ibrahim Fadel`, consoleStyles);
	}

	/**
	 * Creates a pixi app and appends it to the canvas
	 * @return {Object} A pixi app
	 */
	createApp() {
		const hexColour = RGB2HEX(this.colour[0], this.colour[1], this.colour[2]);
		const app = new Application({
			width: this.width,
			height: this.height,
			backgroundColor: hexColour,
		});
		document.body.appendChild(app.view);
		return app;
	}

	/**
	 * Starts the game - Runs the load function
	 */
	start() {
		this.runLoad();
	}

	/**
	 * Loads all textures and spritesheets
	 */
	async runLoad() {
		await load();
		const test = setInterval(() => {
			if (this.spritesheetsLoaded === this.spritesheets.length - 1) {
				this.runCreate();
				clearInterval(test);
			}
		}, 1);
	}

	/**
	 * Runs once, create sprites etc.
	 */
	async runCreate() {
		await create();
		this.runUpdate();
	}

	/**
	 * Runs every frame - Updates all game objects
	 */
	async runUpdate() {
		const TICK = 1000 / this.fps;
		let time = 0;
		let frame = 0;
		this.pixi.app.ticker.add(async (dt) => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - time;
			if (timeDiff < TICK) return;
			if (frame === this.fps) frame = 0;
			frame++;
			time = timeNow;

			this.updateSprites(dt);
			this.updateGroups(dt);
			this.updateTexts();

			this.handleCamera();

			await update();
		});
	}

	/**
	 * Assigns the cameraMoveBools - Whether or not the camera requires movement(left, right, up and down)
	 */
	handleCamera() {
		if (this.camera.followTarget !== undefined) {
			this.cameraMoveBools = this.camera.handleFollowCalculations();
			// console.log(this.cameraMoveBools);
		}
	}

	/**
	 * Update pixi sprite values according to rorke sprite values
	 * @param {Number} dt delta time - Time since last update
	 */
	updateSprites(dt) {
		this.sprites.forEach((sprite) => {
			sprite.update(dt, this.cameraMoveBools);
		});
	}

	/**
	 * Update pixi sprite values according to rorke sprite values for each sprite in group
	 * @param {Number} dt delta time - Time since last update
	 */
	updateGroups(dt) {
		this.groups.forEach((group) => {
			group.update();
			group.sprites.forEach((sprite) => {
				sprite.update(dt, this.cameraMoveBools);
			});
		});
	}

	/**
	 * Update pixi text values according to rorke text values
	 */
	updateTexts() {
		this.texts.forEach((text) => {
			text.update();
		});
	}
}

const global = window;
global.Rorke = Rorke;
// If broken, add || global to the const global declaration
