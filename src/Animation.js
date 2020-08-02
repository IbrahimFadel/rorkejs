export default class Animation {
	constructor(name, frames, options = false, sprite) {
		this.name = name;
		this.frames = frames;
		this.options = options ? options : { speed: 5, repeat: false };
		this.sprite = sprite;
		this.paused = true;
		this.currentFrame = 0;
		this.interval = 0;
		this.callback = undefined;
		this.doneCallback = false;
	}

	play(callback) {
		this.doneCallback = false;
		this.paused = false;
		this.callback = callback;
	}

	pause() {
		this.paused = true;
	}

	setFrame(i) {
		this.sprite.texture = this.sprite.textures[this.frames[i]];
	}

	doneAnimation() {
		if (this.callback && !this.doneCallback) {
			this.callback();
			this.doneCallback = true;
			this.paused = true;
		}
	}

	update() {
		if (this.paused) return;
		if (this.interval === this.options.speed) {
			this.interval = 0;
			if (this.options.repeat) {
				if (this.currentFrame === this.frames.length) {
					this.currentFrame = 0;
					this.doneAnimation();
				}
			} else {
				if (this.currentFrame === this.frames.length) {
					this.currentFrame = 0;
					this.doneAnimation();
					return;
				}
			}

			this.setFrame(this.currentFrame);
			this.currentFrame++;
		}
		this.interval++;
	}
}
