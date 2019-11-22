export default class Animation {
	constructor(name, frames, options, sprite) {
		this.name = name;
		this.frames = frames;
		this.options = options || {
			repeat: false,
			speed: 1,
		};
		this.repeat = this.options.repeat;
		this.speed = this.options.speed;
		this.paused = true;
		this.sprite = sprite;
		this.frame = 0;
		this.interval = 0;
	}

	play() {
		this.paused = false;
	}

	pause() {
		this.paused = true;
	}

	setFrame(i) {
		this.sprite.pixi.sprite.texture = this.frames[i].pixi.texture;
	}

	updateAnimation() {
		this.interval++;
		if (this.interval === this.speed) {
			this.interval = 0;
			if (this.repeat) {
				if (this.frame === this.frames.length) this.frame = 0;
			} else if (this.frame === this.frames.length) return;

			this.setFrame(this.frame);
			this.frame++;
		}
	}

	update() {
		this.setFrame(this.frame);
	}
}
