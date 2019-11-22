import { Application } from 'pixi.js';

import { RGB2HEX } from './Helpers';
import Sprite from './Sprite';
import Texture from './Texture';
import Group from './Group';
import Input from './Input';
import Spritesheet from './Spritesheet';
import Graphics from './Graphics';
import Text from './Text';
import Camera from './Camera';
import Physics from './Physics';

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

	start() {
		this.runLoad();
	}

	async runLoad() {
		await load();
		const test = setInterval(() => {
			if (this.spritesheetsLoaded === this.spritesheets.length - 1) {
				this.runCreate();
				clearInterval(test);
			}
		}, 1);
	}

	async runCreate() {
		await create();
		this.runUpdate();
	}

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

	handleCamera() {
		if (this.camera.followTarget !== undefined) {
			this.cameraMoveBools = this.camera.handleFollowCalculations();
			// console.log(this.cameraMoveBools);
		}
	}

	updateSprites(dt) {
		this.sprites.forEach((sprite) => {
			sprite.update(dt, this.cameraMoveBools);
		});
	}

	updateGroups(dt) {
		this.groups.forEach((group) => {
			group.update();
			group.sprites.forEach((sprite) => {
				sprite.update(dt, this.cameraMoveBools);
			});
		});
	}

	updateTexts() {
		this.texts.forEach((text) => {
			text.update();
		});
	}
}

const global = window;
global.Rorke = Rorke;
// If broken, add || global to the const global declaration
