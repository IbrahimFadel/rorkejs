import * as PIXI from "pixi.js";

export default class Sprite {
	constructor(x, y, textureName, rorke) {
		this.rorke = {
			textures: rorke.textures,
			app: rorke.pixi.app
		};

		this.pixi = {
			sprite: undefined
		};

		this.x = x;
		this.y = y;
		this.textureName = textureName;
		this.angle = 0;
		this.velocity = {
			x: 0,
			y: 0
		};
	}

	async add() {
		let spriteTexture = undefined;
		for (let texture of this.rorke.textures) {
			if (texture.name === this.textureName) {
				spriteTexture = texture;
			}
		}
		const pixiTexture = spriteTexture.pixi.texture;
		const sprite = new PIXI.Sprite(pixiTexture);
		sprite.anchor.set(0.5);
		sprite.x = this.x;
		sprite.y = this.y;
		this.pixi.sprite = sprite;
		this.rorke.app.stage.addChild(sprite);
	}

	updatePos(dt) {
		this.x += (this.velocity.x / 30) * dt;
		this.y += (this.velocity.y / 30) * dt;
		this.pixi.sprite.x = this.x;
		this.pixi.sprite.y = this.y;
	}

	updateRot(dt) {
		this.pixi.sprite.rotation = this.angle;
	}

	update(dt) {
		this.updatePos(dt);
		this.updateRot(dt);
	}

	kill() {
		this.pixi.sprite.destroy();
	}
}
