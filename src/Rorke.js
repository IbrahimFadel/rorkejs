import * as PIXI from "pixi.js";

import { RGB2HEX } from "./Helpers";
import Sprite from "./Sprite";
import Texture from "./Texture";

export default class Rorke {
	constructor(width, height, colour) {
		this.width = width;
		this.height = height;
		this.colour = colour || [0, 0, 0];
		this.version = "1.0";
		this.fps = 60;

		this.PIXI = {
			app: this.createApp()
		};

		this.load = {
			texture: async (name, path) => {
				const newTexture = new Texture(name, path, this);
				await newTexture.load();
			}
		};

		this.add = {
			sprite: async (x, y, textureName) => {
				const newSprite = new Sprite(x, y, textureName, this);
				await newSprite.add();
			}
		};

		this.sprites = [];
		this.textures = [];

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
		this.PIXI.app.ticker.add(async dt => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - time;
			if (timeDiff < TICK) return;
			if (frame === this.fps) frame = 0;
			frame++;
			time = timeNow;

			await update();
		});
	}
}

const global = window || global;
global.Rorke = Rorke;
