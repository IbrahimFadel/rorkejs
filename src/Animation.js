export default class Animation {
	constructor(name, frames, options = { speed: 5, repeat: false }, sprite) {
		this.name = name;
		this.frames = frames;
		this.options = options;
		this.sprite = sprite;

		this.paused = true;
		this.currentFrame = 0;
		this.interval = 0;
	}

	play() {
		this.paused = false;
	}

	pause() {
		this.paused = true;
	}

	setFrame(i) {
		this.sprite.texture = this.sprite.textures[this.frames[i]];
	}

	update() {
		this.interval++;
		if (this.interval === this.options.speed) {
			this.interval = 0;
			if (this.options.repeat) {
				if (this.currentFrame === this.frames.length) this.currentFrame = 0;
			} else {
				if (this.currentFrame === this.frames.length) return;
			}

			this.setFrame(this.currentFrame);
			this.currentFrame++;
		}
	}
}
