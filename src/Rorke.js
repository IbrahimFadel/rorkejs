'use strict';

import { Application, Texture } from 'pixi.js';
import { rgbToHex } from './helpers';
import Loader from './loader';
import Sprite, { SPRITE_TYPES } from './sprite';
import Physics from './physics';
import Input from './input';
import Group from './group';

/**
 * RorkeJS main class
 *
 * @class Rorke
 *
 * @example
 * const game = new Rorke(800, 600, [150, 255, 0], {
	load,
	create: myCreateFunction,
	update
});
 *
 */
export default class Rorke extends Application {
	constructor(width, height, colour, functions) {
		const hexColour = rgbToHex({
			r: colour[0],
			g: colour[1],
			b: colour[2],
		});
		super({ width, height, backgroundColor: hexColour });
		this.width = width;
		this.height = height;
		this.colour = colour;
		this.functions = functions;
		this.Loader = new Loader();
		this.physics = new Physics();
		this.input = new Input();
		this.textures = new Map();
		this.spritesheets = new Map();
		this.sprites = [];
		this.groups = [];

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
			group: () => this.addGroup(),
		};
	}

	/**
	 * Create the Pixi app, load all the textures, then run the create function
	 */
	init() {
		document.body.append(this.view);
		this.functions.load();
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

	/**
	 * Add a texture to the loader's queue
	 * @param {string} name The name of the texture
	 * @param {string} path The path to the texture file
	 */
	async loadTexture(name, path) {
		await this.Loader.addTextureToLoadQueue(name, path);
	}

	/**
	 * Add a spritesheet to the loader's queue
	 * @param {string} name The name of the spritesheet
	 * @param {string} path The path to the spritesheet file
	 * @param {object} options Options: tileW, tileH, numTiles
	 */
	async loadSpritesheet(name, path, options) {
		await this.Loader.addSpritesheetToLoadQueue(name, path, options);
	}

	/**
	 * Run the user's create function, then begin the gameloop
	 */
	runCreate() {
		this.functions.create();
		this.runUpdate();
	}

	/**
	 * Start the game loop
	 */
	runUpdate() {
		this.ticker.add(dt => {
			this.updateSprites(dt);
			this.updateGroups(dt);

			this.functions.update();
		});
	}

	/**
	 * Update the position, angle, etc. of each sprite
	 */
	updateSprites(dt) {
		for (const sprite of this.sprites) {
			sprite.update(dt);
			if (sprite.type === SPRITE_TYPES.SPRITESHEET) {
				// eslint-disable-next-line no-unused-vars
				for (const [name, animation] of sprite._animations.entries()) {
					if (!animation.paused) {
						animation.update();
					}
				}
			}
		}
	}

	/**
	 * Update each sprite within each group
	 */
	updateGroups(dt) {
		for (const group of this.groups) {
			for (const sprite of group.sprites) {
				sprite.update(dt);
				if (sprite.type === SPRITE_TYPES.SPRITESHEET) {
					// eslint-disable-next-line no-unused-vars
					for (const [name, animation] of sprite._animations.entries()) {
						if (!animation.paused) {
							animation.update();
						}
					}
				}
			}
		}
	}

	/**
	 * Add a sprite to the game
	 * @param {number} x Initial x position
	 * @param {number} y Initial y position
	 * @param {string} textureName Texture name
	 */
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

	/**
	 * Add a sprite to the game with a texture
	 * @param {number} x Initial x position
	 * @param {number} y Initial y position
	 * @param {string} texture Texture name
	 */
	addSpriteWithTexture(x, y, texture) {
		const newSprite = new Sprite(x, y, texture, this);
		newSprite.type = SPRITE_TYPES.SPRITE;
		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}

	/**
	 * Add a sprite to the game with a spritesheet
	 * @param {number} x Initial x position
	 * @param {number} y Initial y position
	 * @param {string} spritesheet Spritesheet name
	 */
	addSpriteWithSpritesheet(x, y, spritesheet) {
		const initialTexture = spritesheet.textures[0];

		const newSprite = new Sprite(x, y, initialTexture, this);
		newSprite.type = SPRITE_TYPES.SPRITESHEET;
		newSprite.textures = spritesheet.textures;

		this.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}

	/**
	 * Add a group to the game
	 */
	addGroup() {
		const group = new Group(this);
		this.groups.push(group);
		return group;
	}

	setBackground(textureName) {
		const background = new Sprite(0, 0, this.textures.get(textureName));
		background.anchor.set(0);
		background.type = SPRITE_TYPES.BACKGROUND;
		this.stage.addChild(background);
		this.sprites.unshift(background);

		return background;
	}

	dist(sprite1, sprite2) {
		return Math.sqrt((sprite1.x - sprite2.x)**2 + (sprite1.y - sprite2.y)**2);
	}
}

const global = window || global;
global.Rorke = Rorke;
