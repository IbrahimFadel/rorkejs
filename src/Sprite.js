'use strict';

import { Sprite as PixiSprite } from 'pixi.js';
import Animation from './Animation';
import { toRad } from './helpers';

/**
 * Enum of sprite types
 *
 * @enum SPRITE_TYPES
 */
export const SPRITE_TYPES = {
	SPRITE: 0,
	SPRITESHEET: 1,
};

/**
 * Sprite class
 *
 * @class Sprite
 */
export default class Sprite extends PixiSprite {
	constructor(x, y, texture, rorke) {
		super(texture);
		this.rorke = rorke;
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);
		this.texture = texture;
		this.textures = [];
		this._animations = new Map();
		this.type = undefined;
		this.groupChild = false;
		this.group = undefined;

		this.mass = 100;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.immovable = false;

		this.animations = {
			add: (name, frames, options) => this.addAnimation(name, frames, options),
			play: (name, callback) => this.playAnimation(name, callback),
			pause: name => this.pauseAnimation(name),
		};
	}

	/**
	 * Update the sprite
	 */
	update() {
		if (!this.immovable) {
			this.updatePosition();
		}
	}

	/**
	 * Updte sprite position based on velocity
	 */
	updatePosition() {
		this.x += this.velocity.x / 50;
		this.y += this.velocity.y / 50;
	}

	/**
	 * Add animation
	 */
	addAnimation(name, frames, options) {
		const animation = new Animation(name, frames, options, this);
		this._animations.set(name, animation);
		return animation;
	}

	/**
	 * Play animation
	 */
	playAnimation(name, callback) {
		for (const [key, animation] of this._animations.entries()) {
			if (key === name) animation.play(callback);
			else animation.pause();
		}
	}

	/**
	 * Pause animation at current frame
	 */
	pauseAnimation(name) {
		const animation = this._animations.get(name);
		animation.pause();
	}

	/**
	 * Move forward based on look direction
	 */
	moveForward(speed) {
		const x = Math.cos(toRad(this.angle));
		const y = Math.sin(toRad(this.angle));

		this.velocity.x = x * speed;
		this.velocity.y = y * speed;
	}

	/**
	 * Remove sprite from game
	 */
	kill() {
		const sprites = this.groupChild ? this.group.sprites : this.rorke.sprites;
		const indexOfSprite = sprites.indexOf(this);
		sprites.splice(indexOfSprite, 1);
		this.parent.removeChild(this);
	}

	/**
	 * Hide shown sprite
	 */
	hide() {
		this.visible = false;
	}

	/**
	 * Show hidden sprite
	 */
	show() {
		this.visible = true;
	}
}
