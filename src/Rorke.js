'use strict';

import { Application, resources, Texture } from 'pixi.js';
import { rgbToHex } from './Helpers';
import Loader from './Loader';
import Sprite, { SPRITE_TYPES } from './Sprite';
import Physics from './Physics';
import Input from './Input';

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
		this.input = new Input();
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
			for (const [name, value] of Object.entries(resources)) {
				if (loader.rorkeResources[i].options) {
					const urls = await this.Loader.splitSpritesheetIntoTiles(
						value.data,
						loader.rorkeResources[i].options,
					);
					const textures = urls.map(tile => Texture.from(tile));
					this.spritesheets.set(name, {
						texture: value.texture,
						options: loader.rorkeResources[i].options,
						tiles: urls,
						textures,
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
		for (const sprite of this.sprites) {
			sprite.update();
			if (sprite.type === SPRITE_TYPES.SPRITESHEET) {
				for (const [name, animation] of sprite._animations.entries()) {
					if (!animation.paused) {
						animation.update();
					}
				}
			}
		}
	}

	addSprite(x, y, textureName) {
		let newSprite;
		if (this.textures.has(textureName)) {
			newSprite = this.addSpriteWithTexture(
				x,
				y,
				this.textures.get(textureName),
			);
		} else if (this.spritesheets.has(textureName)) {
			newSprite = this.addSpriteWithSpritesheet(
				x,
				y,
				this.spritesheets.get(textureName),
			);
		}

		return newSprite;
	}

	addSpriteWithTexture(x, y, texture) {
		const newSprite = new Sprite(x, y, texture);
		newSprite.type = SPRITE_TYPES.SPRITE;
		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}

	addSpriteWithSpritesheet(x, y, spritesheet) {
		const initialTexture = spritesheet.textures[0];

		const newSprite = new Sprite(x, y, initialTexture);
		newSprite.type = SPRITE_TYPES.SPRITESHEET;
		newSprite.textures = spritesheet.textures;

		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}
}

const global = window || global;
global.Rorke = Rorke;
