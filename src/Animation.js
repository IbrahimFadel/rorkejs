export default class Animation {
	constructor(name, frames, options) {
		this.name = name;
		this.frames = frames;
		this.options = options;
		this.repeat = options.repeat;
		this.speed = options.speed;
		this.paused = true;
	}
}
