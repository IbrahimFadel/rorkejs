import * as PIXI from "pixi.js";

export default class Sprite {
	constructor(x, y, textureName, rorke) {
		this.x = x;
		this.y = y;
		this.textureName = textureName;

		this.RORKE = {
			textures: rorke.textures,
			app: rorke.PIXI.app,
			sprites: rorke.sprites
		};

		this.PIXI = {
			sprite: undefined
		};
	}

	async add() {
		let spriteTexture = undefined;
		for (let texture of this.RORKE.textures) {
			if (texture.name === this.textureName) {
				spriteTexture = texture;
			}
		}
		const pixiTexture = spriteTexture.PIXI.texture;
		const sprite = new PIXI.Sprite(pixiTexture);
		sprite.anchor.set(0.5);
		sprite.x = this.x;
		sprite.y = this.y;
		this.PIXI.sprite = sprite;
		this.RORKE.app.stage.addChild(sprite);
		this.RORKE.sprites.push(this);
	}
}
