'use strict';

import { Sprite as PixiSprite } from 'pixi.js';
import Animation from './Animation';

export const SPRITE_TYPES = {
	SPRITE: 0,
	SPRITESHEET: 1,
};

export default class Sprite extends PixiSprite {
	constructor(x, y, texture) {
		super(texture);
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);
		this.texture = texture;
		this.textures = [];
		this._animations = new Map();
		this.type = undefined;

		this.mass = 100;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.immovable = false;

		this.animations = {
			add: (name, frames, options) => this.addAnimation(name, frames, options),
			play: name => this.playAnimation(name),
			pause: name => this.pauseAnimation(name),
		};
	}

	update() {
		if (!this.immovable) {
			this.updatePosition();
		}
	}

	updatePosition() {
		this.x += this.velocity.x / 50;
		this.y += this.velocity.y / 50;
	}

	addAnimation(name, frames, options) {
		const animation = new Animation(name, frames, options, this);
		this._animations.set(name, animation);
		return animation;
	}

	playAnimation(name) {
		for (const [key, animation] of this._animations.entries()) {
			if (key === name) animation.play();
			else animation.pause();
		}
	}

	pauseAnimation(name) {
		const animation = this._animations.get(name);
		animation.pause();
	}
}
