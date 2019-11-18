import { Sprite as PixiSprite, Rectangle } from "pixi.js";

import Animation from "./Animation";
import { toDegree } from "./Helpers";

export default class Sprite {
	constructor(x, y, textureName, rorke) {
		this.rorke = {
			textures: rorke.textures,
			spritesheets: rorke.spritesheets,
			app: rorke.pixi.app,
			graphics: rorke.graphics,
		};

		this.pixi = {
			sprite: undefined,
		};

		this.scale = {
			x: 1,
			y: 1,
		};
		this.fixed = false;
		this.x = x;
		this.y = y;
		this.textureName = textureName;
		this.angle = 0;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.mass = 1;

		this.hitbox = undefined;

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
				let animationFrames = [];
				for (let i = 0; i < this.textures.length; i++) {
					for (let index of frames) {
						if (i === index) {
							animationFrames.push(this.textures[i]);
						}
					}
				}
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
				for (let animation of this._animations) {
					animation.pause();
				}
				const animation = this.getAnimation(name);
				animation.play();
			},
			pause: name => {
				const animation = this.getAnimation(name);
				animation.pause();
			},
			setFrame: (name, i) => {
				const animation = this.getAnimation(name);
				animation.frame = i;
				animation.update();
			},
		};

		this.set = {
			scale: (x, y) => {
				if (x === undefined) throw "Must give a value when setting scale";
				if (y === undefined) {
					this.scale.x = x;
					this.scale.y = x;
				} else {
					this.scale.x = x;
					this.scale.y = y;
				}
			},
			texture: name => {
				this.pixi.sprite.texture = this.getTexture(name).pixi.texture;
			},
		};
	}

	getTexture(name) {
		for (let texture of this.rorke.textures) {
			if (texture.name === name) {
				return texture;
			}
		}
	}

	getAnimation(name) {
		for (let animation of this._animations) {
			if (animation.name === name) {
				return animation;
			}
		}
	}

	makeWorldBoundSprite() {
		const sprite = new PixiSprite();
		sprite.x = this.x;
		sprite.y = this.y;
		// sprite.height
	}

	async add() {
		if (this.textureName === "SET_WORLD_BOUNDS") {
			this.makeWorldBoundSprite();
			return;
		}
		let spriteTexture = undefined;
		let nameMatches = 0;
		let textureType = -1;
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
		const sprite = new PixiSprite(pixiTexture);
		sprite.anchor.set(0.5);
		sprite.x = this.x;
		sprite.y = this.y;
		this.pixi.sprite = sprite;
		this.rorke.app.stage.addChild(sprite);
	}

	addSpriteWithSpritesheet(spritesheet) {
		this.textures = spritesheet.textures;

		const initialFrame = this.textures[0];
		const sprite = new PixiSprite(initialFrame.pixi.texture);
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
		this.pixi.sprite.angle = this.angle;
	}

	updateScale() {
		this.pixi.sprite.scale.set(this.scale.x, this.scale.y);
	}

	handleCamera(bools, dt) {
		// console.log(bools.left, dt);
		if (this.fixed) return;
		if (bools.left) this.x += 5 * dt;
		else if (bools.right) this.x -= 5 * dt;
		else this.x = this.x;
		if (bools.up) this.y -= 5 * dt;
		else if (bools.down) this.y += 5 * dt;
		else this.y = this.y;
	}

	update(dt, cameraMoveBools) {
		if (cameraMoveBools !== undefined) this.handleCamera(cameraMoveBools, dt);

		this.updateScale();
		this.updatePos(dt);
		this.updateRot(dt);
		if (this.type === this.SPRITESHEET) {
			for (let animation of this._animations) {
				if (!animation.paused) {
					animation.updateAnimation();
				}
			}
		}
	}

	kill() {
		this.pixi.sprite.destroy();
	}

	rotateTo(target) {
		const angle =
			toDegree(Math.atan2(target.y - this.y, target.x - this.x)) + 90;
		this.angle = angle;
	}

	moveTo(target, speed) {
		if (this.dist(target) <= 1) {
			this.velocity.x = 0;
			this.velocity.y = 0;
			return;
		}
		const followedSpriteX = target.x;
		const followedSpriteY = target.y;
		const followingSpriteX = this.x;
		const followingSpriteY = this.y;
		if (followedSpriteX > followingSpriteX) {
			this.velocity.x = speed;
		} else if (followedSpriteX < followingSpriteX) {
			this.velocity.x = -speed;
		} else {
			target.velocity.x = 0;
		}
		if (followedSpriteY > followingSpriteY) {
			this.velocity.y = speed;
		} else if (followedSpriteY < followingSpriteY) {
			this.velocity.y = -speed;
		} else {
			target.velocity.y = 0;
		}
	}

	dist(target) {
		return Math.sqrt(
			Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)
		);
	}

	showHitBox() {
		if (this.hitbox !== undefined) {
			this.hitbox.remove();
		}
		this.rorke.graphics.fill(0x000000, 0);
		this.rorke.graphics.border(2);
		this.hitbox = this.rorke.graphics.drawShape(
			this.x - this.pixi.sprite.width / 2,
			this.y - this.pixi.sprite.height / 2,
			this.x + this.pixi.sprite.width / 2,
			this.y - this.pixi.sprite.height / 2,
			this.x + this.pixi.sprite.width / 2,
			this.y + this.pixi.sprite.height / 2,
			this.x - this.pixi.sprite.width / 2,
			this.y + this.pixi.sprite.height / 2
		);
		// this.rorke.graphics.drawShape(0, 0, 100, 0, 100, 100, 0, 100);
		// this.rorke.graphics.moveTo(
		// this.x - this.pixi.sprite.width / 2,
		// this.y - this.pixi.sprite.height / 2
		// );
		// this.rorke.graphics.moveTo(50, 50);
		// console.log(this.x, this.y);
		// this.rorke.graphics.lineTo(this.x, this.y);
		// this.rorke.graphics.moveTo(
		// 	this.x - this.pixi.sprite.width / 2,
		// 	this.y - this.pixi.sprite.height / 2
		// );
		// this.rorke.graphics.lineTo(
		// 	this.x + this.pixi.sprite.width / 2,
		// 	this.y - this.pixi.sprite.height / 2
		// );
		// // this.rorke.graphics.moveTo(
		// // 	this.x + this.pixi.sprite.width / 2,
		// // 	this.y - this.pixi.sprite.height / 2
		// // );
		// this.rorke.graphics.lineTo(
		// 	this.x + this.pixi.sprite.width / 2,
		// 	this.y + this.pixi.sprite.height / 2
		// );
		// this.rorke.graphics.lineTo(
		// 	this.x - this.pixi.sprite.width / 2,
		// 	this.y + this.pixi.sprite.height / 2
		// );
		// this.rorke.graphics.lineTo(
		// 	this.x - this.pixi.sprite.width / 2,
		// 	this.y - this.pixi.sprite.height / 2
		// );
		// this.rorke.graphics.moveTo(0, 0);
		// this.rorke.graphics.lineTo(100, 100);
		// console.log(this.x - this.pixi.sprite.width / 2);
		// console.log(this.x + this.pixi.sprite.width / 2);
		// this.rorke.graphics.moveTo(this.x - this.pixi.sprite.width / 2, );
		// this.rorke.graphics.lineTo(this.x + this.pixi.sprite.width / 2);
		// let texture;
		// if (this.type === this.SPRITESHEET) {
		// texture = this.textures[0];
		// console.log(texture.pixi.texture);
		// }
		// const texture = this.getTexture(this.textureName);
		// console.log(this.textureName);
		// console.log(this.getTexture(this.textureName));
		// console.log(texture.getLocalBounds());
		// this.pixi.hitbox = new Rectangle(0, 0, 0, 0);
		// const lb = this.pixi.sprite._texture.getLocalBounds();
		// this.rorke.graphics.fill(0x0000ff);
		// const graphic = this.rorke.graphics.drawRect(
		// lb.x,
		// lb.y,
		// lb.width,
		// lb.height
		// );
		// this.pixi.hitbox = new Rectangle(lb.x, lb.y, lb.width, lb.height);
		// graphics.hitArea = new PIXI.Rectangle(
		// 	lb.x - 25,
		// 	lb.y - 25,
		// 	lb.width + 50,
		// 	lb.height + 50
		// );
	}
}
