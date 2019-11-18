import { Container } from "pixi.js";

import Sprite from "./Sprite";

export default class Group {
	constructor(rorke) {
		this.rorke = {
			rorke: rorke,
			app: rorke.pixi.app,
		};
		this.pixi = {
			container: undefined,
		};

		this.sprites = [];
		this.x = 0;
		this.y = 0;
		this.angle = 0;
	}

	async add() {
		this.pixi.container = new Container();
		this.rorke.app.stage.addChild(this.pixi.container);
	}

	async create(x, y, textureName) {
		const newSprite = new Sprite(x, y, textureName, this.rorke.rorke);
		await newSprite.add();
		this.sprites.push(newSprite);
		this.pixi.container.addChild(newSprite.pixi.sprite);
		return newSprite;
	}

	async remove(sprite) {
		this.pixi.container.removeChild(sprite.pixi.sprite);
		const i = this.sprites.indexOf(sprite);
		this.sprites.splice(i, i + 1);
		sprite.kill();
	}

	updatePos() {
		this.pixi.container.x = this.x;
		this.pixi.container.y = this.y;
	}

	updateRot() {
		this.pixi.container.rotation = this.angle;
	}

	update() {
		this.updatePos();
		this.updateRot();
	}
}
