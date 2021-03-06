'use strict';

import { Loader as PixiLoader } from 'pixi.js';

/**
 * Loader class
 *
 * @class Loader
 */
export default class Loader extends PixiLoader {
	constructor() {
		super();
		this.rorkeResources = [];
	}

	/**
	 * Queue a texture to be loaded by Pixi
	 * @param {string} name Name of texture
	 * @param {string} path Path to texture
	 */
	async addTextureToLoadQueue(name, path) {
		this.add(name, path);
		this.rorkeResources.push({ name, options: undefined });
	}

	/**
	 * Queue a spritesheet to be loaded by Pixi
	 * @param {string} name Name of spritesheet
	 * @param {string} path Path to spritesheet
	 */
	async addSpritesheetToLoadQueue(name, path, options) {
		this.add(name, path);
		this.rorkeResources.push({ name, options });
	}

	/**
	 * Splite a spritesheet into an array of tiles
	 * @param {string} spritesheet Path to spritesheet
	 * @param {object} options Options for splitting the spritesheet -- tileW(width), tileH(height), numTiles
	 */
	async splitSpritesheetIntoTiles(spritesheet, options) {
		const can = document.createElement('canvas');
		can.width = options.tileW;
		can.height = options.tileH;
		const context = can.getContext('2d');
		const img = new Image();
		img.src = spritesheet.src;
		let tileUrls = [];
		img.addEventListener(
			'load',
			await (() => {
				const spritesheetWidth = img.width;
				let xdist = 0;
				let ydist = 0;
				let x = 0;
				let y = 0;
				for (let i = 0; i < options.numTiles; i++) {
					if (x >= spritesheetWidth / options.tileW) {
						x = 0;
						xdist = 0;
						y++;
					}
					xdist = x * options.tileW;
					ydist = y * options.tileH;

					context.drawImage(
						img,
						xdist,
						ydist,
						options.tileW,
						options.tileH,
						0,
						0,
						options.tileW,
						options.tileH,
					);
					const url = can.toDataURL();
					tileUrls.push(url);
					context.clearRect(0, 0, can.width, can.height);
					x++;
				}
			})(),
		);

		return tileUrls;
	}
}
