import { Texture as PixiTexture } from 'pixi.js';

/**
 * Rorke Texture
 *
 * @example
 *
 * await game.load.texture("mytexture", "path/to/texture.png");
 *
 * @param {String} name name of texture
 * @param {String} path path to texture image
 * @param {Object} rorke instance of game
 */
export default class Texture {
	constructor(name, path, rorke) {
		this.name = name;
		this.path = path;
		this.rorke = {
			textures: rorke.textures,
		};
		this.pixi = {
			texture: undefined,
		};
	}

	/**
	 * Creates new pixi texture and adds it to rorke's textures
	 */
	async load() {
		this.rorke.textures.forEach((texture) => {
			if (texture.name === this.name) {
				throw new Error('Cannot load textures of the same name!');
			}
		});
		const newTexture = PixiTexture.from(this.path);
		this.pixi.texture = newTexture;
	}
}
