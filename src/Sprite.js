'use strict';

import { Sprite as PixiSprite } from 'pixi.js';

export default class Sprite extends PixiSprite {
	constructor(x, y, texture) {
		super(texture);
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);
		this.texture = texture;

		this.mass = 100;
		this.velocity = {
			x: 0,
			y: 0
		}
	}

	update() {
		this.updatePosition();
	}

	updatePosition() {
		this.x += this.velocity.x / 50;
		this.y += this.velocity.y / 50;
	}

	// moveForward(velocity) {
	// 	const y = Math.sin(this.angle) * velocity;
	// 	const x = Math.cos(this.angle) * velocity;

	// 	this.velocity.x = x;
	// 	this.velocity.y = y;
	// }
}
