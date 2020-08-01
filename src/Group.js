import { Container } from 'pixi.js';
import Sprite, { SPRITE_TYPES } from './Sprite';

export default class Group extends Container {
	constructor(rorke) {
		super();
		this.rorke = rorke;
		this.sprites = [];
		this.isGroup = true;
	}

	create(x, y, textureName) {
		let newSprite;
		if (this.rorke.textures.has(textureName)) {
			newSprite = this.addSpriteWithTexture(
				x,
				y,
				this.rorke.textures.get(textureName),
			);
		} else if (this.rorke.spritesheets.has(textureName)) {
			newSprite = this.addSpriteWithSpritesheet(
				x,
				y,
				this.rorke.spritesheets.get(textureName),
			);
		}

		newSprite.groupChild = true;
		newSprite.group = this;

		return newSprite;
	}

	addSpriteWithTexture(x, y, texture) {
		const newSprite = new Sprite(x, y, texture, this.rorke);
		newSprite.type = SPRITE_TYPES.SPRITE;
		this.rorke.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}

	addSpriteWithSpritesheet(x, y, spritesheet) {
		const initialTexture = spritesheet.textures[0];

		const newSprite = new Sprite(x, y, initialTexture, this.rorke);
		newSprite.type = SPRITE_TYPES.SPRITESHEET;
		newSprite.textures = spritesheet.textures;

		this.rorke.stage.addChild(newSprite);
		this.sprites.push(newSprite);

		return newSprite;
	}
}
