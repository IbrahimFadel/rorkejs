'use strict';

import { Sprite as PixiSprite } from 'pixi.js';

export default class Sprite extends PixiSprite {
	constructor(x, y, texture) {
		super(texture);
		this.x = x;
		this.y = y;
		this.anchor.set(0.5);
		this.texture = texture;
	}
}
