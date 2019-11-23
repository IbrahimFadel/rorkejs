import {Text as PixiText, TextStyle} from 'pixi.js';

export default class Text {
	constructor(x, y, text, options, rorke) {
		this.pixi = {
			text: undefined,
		};
		this.rorke = {
			app: rorke.pixi.app,
		};
		this.x = x;
		this.y = y;
		this.text = text;
		this.options = options;
		this.angle = 0;
	}

	add() {
		let style;
		let newText;
		if (this.options) {
			style = new TextStyle(this.options);
			newText = new PixiText(this.text, style);
		} else {
			newText = new PixiText(this.text);
		}
		newText.x = this.x;
		newText.y = this.y;
		this.pixi.text = newText;
		this.rorke.app.stage.addChild(newText);
		return this;
	}

	updatePos() {
		this.pixi.text.x = this.x;
		this.pixi.text.y = this.y;
	}

	updateRot() {
		this.pixi.text.angle = this.angle;
	}

	update() {
		this.updatePos();
		this.updateRot();
	}
}
