import * as PIXI from "pixi.js";

import Animation from "./Animation";

export default class Sprite {
	constructor(x, y, textureName, rorke) {
		this.rorke = {
			textures: rorke.textures,
			spritesheets: rorke.spritesheets,
			app: rorke.pixi.app,
		};

		this.pixi = {
			sprite: undefined,
		};

		this.x = x;
		this.y = y;
		this.textureName = textureName;
		this.angle = 0;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.TEXTURE = 0;
		this.SPRITESHEET = 1;
		this.type;

		this.textures = [];

		this._animations = [];
		this.animations = {
			add: (name, frames, options) => {
				for (let animation of this._animations) {
					if (animation.name === name) {
						throw "Can't load animations of same name!";
					}
				}
				// const animationFrames = this.textures.map((texture, i) => {
				// 	if (i === frames[i]) {
				// 		console.log("hi");
				// 		return texture;
				// 	}
				// 	// for (let index of frames) {
				// 	// return i === index ? texture;
				// 	// if (i === index) {
				// 	// 	console.log("hi");
				// 	// 	return texture;
				// 	// }
				// 	// }
				// 	// return i === frames
				// });
				// console.log(animationFrames);
				let animationFrames = [];
				for (let i = 0; i < this.textures.length; i++) {
					for (let index of frames) {
						if (i === index) {
							animationFrames.push(this.textures[i]);
						}
					}
				}
				console.log(animationFrames);
				const newAnimation = new Animation(
					name,
					animationFrames,
					options,
					this
				);
				this._animations.push(newAnimation);
			},
			remove: name => {
				const animation = this.getAnimation(name);
				const i = this._animations.indexOf(animation);
				this._animations.splice(i, i + 1);
			},
			play: name => {
				const animation = this.getAnimation(name);
				animation.play();
			},
			pause: name => {},
		};
	}

	getAnimation(name) {
		for (let animation of this._animations) {
			if (animation.name === name) {
				return animation;
			}
		}
	}

	async add() {
		let spriteTexture = undefined;
		let nameMatches = 0;
		let textureType;
		for (let texture of this.rorke.textures) {
			if (texture.name === this.textureName) {
				spriteTexture = texture;
				nameMatches++;
				textureType = this.TEXTURE;
			}
		}
		for (let spritesheet of this.rorke.spritesheets) {
			if (spritesheet.name === this.textureName) {
				spriteTexture = spritesheet;
				nameMatches++;
				textureType = this.SPRITESHEET;
			}
		}

		if (nameMatches > 1) {
			throw "Don't load spritesheets and textures with the same name!";
		} else if (nameMatches < 1) {
			throw "Texture or Spritesheet could not be found";
		}

		if (textureType === 0) {
			this.type = this.TEXTURE;
			this.addSpriteWithTexture(spriteTexture);
		} else if (textureType === 1) {
			this.type = this.SPRITESHEET;
			this.addSpriteWithSpritesheet(spriteTexture);
		} else if (textureType === -1) {
			throw "The texture you specified does not match any Rorke texture types. Make sure it is a texture or spritesheet";
		}
	}

	addSpriteWithTexture(spriteTexture) {
		const pixiTexture = spriteTexture.pixi.texture;
		const sprite = new PIXI.Sprite(pixiTexture);
		sprite.anchor.set(0.5);
		sprite.x = this.x;
		sprite.y = this.y;
		this.pixi.sprite = sprite;
		this.rorke.app.stage.addChild(sprite);
	}

	addSpriteWithSpritesheet(spritesheet) {
		this.textures = spritesheet.textures;

		const initialFrame = this.textures[0];
		const sprite = new PIXI.Sprite(initialFrame.pixi.texture);
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
		if (this.type === this.SPRITESHEET) {
			for (let animation of this._animations) {
				if (!animation.paused) {
					animation.update();
				}
			}
		}
	}

	kill() {
		this.pixi.sprite.destroy();
	}
}
