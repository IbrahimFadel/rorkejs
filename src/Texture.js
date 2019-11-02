import * as PIXI from "pixi.js";

export default class Texture {
	constructor(name, path, rorke) {
		this.name = name;
		this.path = path;
		this.RORKE = {
			textures: rorke.textures
		};
		this.PIXI = {
			texture: undefined
		};
	}

	async load() {
		for (let texture of this.RORKE.textures) {
			if (texture.name === this.name) {
				throw "Cannot load textures of the same name!";
			}
		}
		const newTexture = PIXI.Texture.from(this.path);
		this.PIXI.texture = newTexture;
		this.RORKE.textures.push(this);
	}
}
