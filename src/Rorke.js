'use strict';

import { Application } from 'pixi.js';
import { rgbToHex } from './Helpers';
import Loader from './Loader';
import Sprite from './Sprite';

export default class Rorke extends Application {
	constructor(width, height, colour) {
		const hexColour = rgbToHex({
			r: colour[0],
			g: colour[1],
			b: colour[2],
		});
		super({ width, height, backgroundColor: hexColour });
		this.width = width;
		this.height = height;
		this.colour = colour;
		this.Loader = new Loader();
		this.textures = new Map();
		this.spritesheets = new Map();
		this.sprites = [];

		this.load = {
			texture: (name, path) => {
				this.loadTexture(name, path);
			},
			spritesheet: (name, path, options) => {
				this.loadSpritesheet(name, path, options);
			},
		};

		this.add = {
			sprite: (x, y, textureName) => this.addSprite(x, y, textureName),
		};
	}

	init() {
		document.body.appendChild(this.view);
		load();
		this.Loader.load((loader, resources) => {
			let i = 0;
			for (const [key, value] of Object.entries(resources)) {
				if (loader.rorkeResources[i].options) {
					this.Loader.splitSpritesheetIntoTiles(
						value.data,
						loader.rorkeResources[i].options,
						urls => {
							this.spritesheets.set(key, {
								texture: value.texture,
								options: loader.rorkeResources[i].options,
								tiles: urls,
							});
							i++;
						},
					);
				} else {
					this.textures.set(key, value.texture);
					i++;
				}
			}
			this.runCreate();
		});
	}

	async loadTexture(name, path) {
		await this.Loader.addTextureToLoadQueue(name, path);
	}

	async loadSpritesheet(name, path, options) {
		await this.Loader.addSpritesheetToLoadQueue(name, path, options);
	}

	runCreate() {
		console.log(this.textures, this.spritesheets);
		create();
		this.runUpdate();
	}

	runUpdate() {
		this.ticker.add(() => {
			update();
		});
	}

	addSprite(x, y, textureName) {
		const texture = this.textures.get(textureName);
		const newSprite = new Sprite(x, y, texture);
		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);
	}
}

const global = window || global;
global.Rorke = Rorke;
