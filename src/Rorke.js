import * as PIXI from "pixi.js";

import { RGB2HEX } from "./Helpers";
import Sprite from "./Sprite";
import Texture from "./Texture";
import Group from "./Group";
import Input from "./Input";
import Spritesheet from "./Spritesheet";

export default class Rorke {
	constructor(width, height, colour) {
		this.width = width;
		this.height = height;
		this.colour = colour || [0, 0, 0];
		this.version = "1.0";
		this.fps = 60;
		this.input = new Input();

		this.pixi = {
			app: this.createApp()
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
				await newSpritesheet.load();
				this.spritesheets.push(newSpritesheet);
				console.log(this.spritesheets);
			}
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
			}
		};

		this.sprites = [];
		this.groups = [];

		this.textures = [];
		this.spritesheets = [];

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
		const app = new PIXI.Application({
			width: this.width,
			height: this.height,
			backgroundColor: hexColour
		});
		document.body.appendChild(app.view);
		return app;
	}

	start() {
		this.runLoad();
	}

	async runLoad() {
		await load();
		this.runCreate();
	}

	async runCreate() {
		await create();
		this.runUpdate();
	}

	async runUpdate() {
		const TICK = 1000 / this.fps;
		let time = 0;
		let frame = 0;
		this.pixi.app.ticker.add(async dt => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - time;
			if (timeDiff < TICK) return;
			if (frame === this.fps) frame = 0;
			frame++;
			time = timeNow;

			for (let sprite of this.sprites) {
				sprite.update(dt);
			}

			for (let group of this.groups) {
				group.update();
				for (let sprite of group.sprites) {
					sprite.update(dt);
				}
			}

			await update();
		});
	}
}

const global = window || global;
global.Rorke = Rorke;
