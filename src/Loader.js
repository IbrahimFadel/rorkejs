'use strict';

import { Loader as PixiLoader } from 'pixi.js';

export default class Loader extends PixiLoader {
	constructor() {
		super();
		this.rorkeResources = [];
	}

	async addTextureToLoadQueue(name, path) {
		this.add(name, path);
		this.rorkeResources.push({ name, options: null });
	}

	async addSpritesheetToLoadQueue(name, path, options) {
		this.add(name, path);
		this.rorkeResources.push({ name, options });
	}

	async splitSpritesheetIntoTiles(spritesheet, options) {
		const can = document.createElement('canvas');
		can.width = options.tileW;
		can.height = options.tileH;
		const ctx = can.getContext('2d');
		const img = new Image();
		img.src = spritesheet.src;
		let tileUrls = [];
		img.onload = await (() => {
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

				ctx.drawImage(
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
				ctx.clearRect(0, 0, can.width, can.height);
				x++;
			}
		})();

		return tileUrls;
	}
}
