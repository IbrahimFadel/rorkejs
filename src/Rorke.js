'use strict';

import { Application, resources } from 'pixi.js';
import { rgbToHex } from './Helpers';
import Loader from './Loader';
import Sprite from './Sprite';
import Physics from './Physics';

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
		this.physics = new Physics();
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
		this.Loader.load(async (loader, resources) => {
			let i = 0;
			for(const [name, value] of Object.entries(resources)) {
				if(loader.rorkeResources[i].options) {
					const urls = await this.Loader.splitSpritesheetIntoTiles(value.data, loader.rorkeResources[i].options);
					this.spritesheets.set(name, {
						texture: value.texture,
						options: loader.rorkeResources[i].options,
						tiles: urls
					});
				} else {
					this.textures.set(name, value.texture);
				}
				i++;
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
		create();
		this.runUpdate();
	}

	runUpdate() {
		this.ticker.add(() => {

			this.updateSprites();

			update();
		});
	}

	updateSprites() {
		for(const sprite of this.sprites) {
			sprite.update();
		}
	}

	addSprite(x, y, textureName) {
		const texture = this.textures.get(textureName);
		const newSprite = new Sprite(x, y, texture);
		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}
}

const global = window || global;
global.Rorke = Rorke;
