import {Texture as PixiTexture} from 'pixi.js';

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
