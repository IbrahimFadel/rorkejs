import { Texture as PixiTexture } from "pixi.js";

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
		for (let texture of this.rorke.textures) {
			if (texture.name === this.name) {
				throw "Cannot load textures of the same name!";
			}
		}
		const newTexture = PixiTexture.from(this.path);
		this.pixi.texture = newTexture;
	}
}
