export default class Animation {
	constructor(name, frames, options = { speed: 5, repeat: false }, sprite) {
		this.name = name;
		this.frames = frames;
		this.options = options;
		this.sprite = sprite;
		this.paused = true;
		this.currentFrame = 0;
		this.interval = 0;
		this.cb = undefined;
		this.doneCb = false;
	}

	play(cb) {
		this.paused = false;
		this.cb = cb;
	}

	pause() {
		this.paused = true;
	}

	setFrame(i) {
		this.sprite.texture = this.sprite.textures[this.frames[i]];
	}

	doneAnimation() {
		if (this.cb && !this.doneCb) {
			this.cb();
			// this.pause();
		}
	}

	update() {
		this.interval++;
		if (this.interval === this.options.speed) {
			this.interval = 0;
			if (this.options.repeat) {
				if (this.currentFrame === this.frames.length) {
					this.currentFrame = 0;
					this.doneAnimation();
					this.doneCb = true;
				}
			} else {
				if (this.currentFrame === this.frames.length) {
					this.doneAnimation();
					this.doneCb = true;
					// this.currentFrame = 0;
					return;
				}
			}

			this.setFrame(this.currentFrame);
			this.currentFrame++;
		}
	}
}
