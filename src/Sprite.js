import { Sprite as PixiSprite } from 'pixi.js';

import Animation from './Animation';
import { toDegree } from './Helpers';

/**
 * Rorke Sprite
 *
 * @example
 *
 * let player;
 * async function create() {
 * 	player = await game.add.sprite(game.width / 2, game.height / 2, "playertexture");
 * }
 *
 * async function update() {
 * 	player.x += 1;
 *	player.y += 1;
 *	player.angle += 0.1;
 * }
 *
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @param {String} textureName name of texture
 * @param {Object} rorke instance of game
 */
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
		this.type = undefined;

		this.textures = [];

		this._animations = [];

		this.animations = {
			add: (name, frames, options) => {
				this._animations.forEach((animation) => {
					if (animation.name === name) {
						throw new Error("Can't load animations of same name!");
					}
				});
				const animationFrames = [];
				for (let i = 0; i < this.textures.length; i++) {
					frames.forEach((index) => {
						if (i === index) {
							animationFrames.push(this.textures[i]);
						}
					});
				}
				const newAnimation = new Animation(
					name,
					animationFrames,
					options,
					this,
				);
				this._animations.push(newAnimation);
			},
			remove: (name) => {
				const animation = this.getAnimation(name);
				const i = this._animations.indexOf(animation);
				this._animations.splice(i, i + 1);
			},
			play: (name) => {
				this._animations.forEach((animation) => {
					animation.pause();
				});
				const animation = this.getAnimation(name);
				animation.play();
			},
			pause: (name) => {
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
			scale: (scaleX, scaleY) => {
				if (scaleX === undefined) {
					throw new Error('Must give a value when setting scale');
				}
				if (scaleY === undefined) {
					this.scale.x = scaleX;
					this.scale.y = scaleX;
				} else {
					this.scale.x = scaleX;
					this.scale.y = scaleY;
				}
			},
			texture: (name) => {
				this.pixi.sprite.texture = this.getTexture(name).pixi.texture;
			},
		};
	}

	/**
	 * Get a Rorke texture given its name
	 * @param {String} name name of texture
	 * @return {Object|Number} Texture if it exists, otherwise -1
	 */
	getTexture(name) {
		this.rorke.textures.foreach((texture) => {
			if (texture.name === name) {
				return texture;
			}
			return -1;
		});
	}

	/**
	 * Get a Rorke Animation given its name
	 * @param {String} name name of animation
	 * @return {Object|Number} Animation if it exists, otherwise -1
	 */
	getAnimation(name) {
		this._animations.forEach((animation) => {
			if (animation.name === name) {
				return animation;
			}
			return -1;
		});
	}

	makeWorldBoundSprite() {
		const sprite = new PixiSprite();
		sprite.x = this.x;
		sprite.y = this.y;
		// sprite.height
	}

	/**
	 * Create a pixi sprite and add it to the game
	 */
	async add() {
		if (this.textureName === 'SET_WORLD_BOUNDS') {
			this.makeWorldBoundSprite();
			return;
		}
		let spriteTexture;
		let nameMatches = 0;
		let textureType = -1;

		this.rorke.textures.forEach((texture) => {
			if (texture.name === this.textureName) {
				spriteTexture = texture;
				nameMatches++;
				textureType = this.TEXTURE;
			}
		});
		this.rorke.spritesheets.forEach((spritesheet) => {
			if (spritesheet.name === this.textureName) {
				spriteTexture = spritesheet;
				nameMatches++;
				textureType = this.SPRITESHEET;
			}
		});

		if (nameMatches > 1) {
			throw new Error(
				"Don't load spritesheets and textures with the same name!",
			);
		} else if (nameMatches < 1) {
			throw new Error('Texture or Spritesheet could not be found');
		}

		if (textureType === 0) {
			this.type = this.TEXTURE;
			this.addSpriteWithTexture(spriteTexture);
		} else if (textureType === 1) {
			this.type = this.SPRITESHEET;
			this.addSpriteWithSpritesheet(spriteTexture);
		} else if (textureType === -1) {
			throw new Error(
				'The texture you specified does not match any Rorke texture types. Make sure it is a texture or spritesheet',
			);
		}
	}

	/**
	 * Create a new sprite with a Texture
	 * @param {Object} spriteTexture the texture
	 */
	addSpriteWithTexture(spriteTexture) {
		const pixiTexture = spriteTexture.pixi.texture;
		const sprite = new PixiSprite(pixiTexture);
		sprite.anchor.set(0.5);
		sprite.x = this.x;
		sprite.y = this.y;
		this.pixi.sprite = sprite;
		this.rorke.app.stage.addChild(sprite);
	}

	/**
	 * Create a new sprite with a Spritesheet
	 * @param {Object} spritesheet the spritesheet
	 */
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

	/**
	 * Update the x and y values of the pixi sprite according to the rorke sprite x and y values
	 * @param {Number} dt delta time
	 */
	updatePos(dt) {
		this.x += (this.velocity.x / 30) * dt;
		this.y += (this.velocity.y / 30) * dt;
		this.pixi.sprite.x = this.x;
		this.pixi.sprite.y = this.y;
	}

	/**
	 * Update the angle value of the pixi sprite according to the rorke angle
	 */
	updateRot() {
		this.pixi.sprite.angle = this.angle;
	}

	/**
	 * Update the scale value of the pixi sprite according to the rorke scale
	 */
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

	/**
	 * Update all the pixi values according to all the rorke sprite values, and handle any animation
	 * @param {Number} dt delta time
	 * @param {Object} cameraMoveBools boolean values of the camera movements
	 */
	update(dt, cameraMoveBools) {
		if (cameraMoveBools !== undefined) this.handleCamera(cameraMoveBools, dt);

		this.updateScale();
		this.updatePos(dt);
		this.updateRot();
		if (this.type === this.SPRITESHEET) {
			this._animations.forEach((animation) => {
				if (!animation.paused) {
					animation.updateAnimation();
				}
			});
		}
	}

	/**
	 * Kill a sprite
	 */
	kill() {
		this.pixi.sprite.destroy();
	}

	/**
	 * Rotate towards a sprite
	 * @param {Object} target Sprite to rotate towards
	 */
	rotateTo(target) {
		const angle =
			toDegree(Math.atan2(target.y - this.y, target.x - this.x)) + 90;
		this.angle = angle;
	}

	/**
	 * Move towards a sprite
	 * @param {Object} target Sprite to move towards
	 * @param {Number} speed Velocity at which to move
	 */
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

	/**
	 * Get distance to a sprite
	 * @param {Object} target Sprite to get distance to
	 */
	dist(target) {
		return Math.sqrt(
			(target.x - this.x) ** 2 + (target.y - this.y) ** 2,
			// Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2),
		);
	}

	/**
	 * Show the hitbox around a sprite
	 */
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
			this.y + this.pixi.sprite.height / 2,
		);
	}
}
