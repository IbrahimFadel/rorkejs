import {Graphics} from 'pixi.js';

export default class Graphic {
	constructor(type, options, fillColour, fillAlpha, border, rorke) {
		this.pixi = {
			graphic: new Graphics(),
		};
		this.rorke = {
			app: rorke.pixi.app,
		};
		this.fillColour = fillColour;
		this.fillAlpha = fillAlpha;
		this.type = type;
		this.options = options;
		this.border = border;
	}

	draw() {
		this.rorke.app.stage.addChild(this.pixi.graphic);
		this.pixi.graphic.beginFill(this.fillColour, this.fillAlpha);
		const {lineWidth, lineColour, lineAlpha, linePosition} = this.border;
		this.pixi.graphic.lineStyle(lineWidth, lineColour, lineAlpha, linePosition);
		if (this.type === 0) {
			const {x, y, width, height} = this.options;
			this.drawRect(x, y, width, height);
		} else if (this.type === 1) {
			const {x, y, r1, r2} = this.options;
			this.drawEllipse(x, y, r1, r2);
		} else if (this.type === 2) {
			this.drawShape(this.options);
		} else if (this.type === 3) {
			const {x, y} = this.options;
			this.lineTo(x, y);
		} else if (this.type === 4) {
			const {x, y} = this.options;
			this.moveTo(x, y);
		}
	}

	drawRect(x, y, width, height) {
		this.pixi.graphic.drawRect(x, y, width, height);
	}

	drawEllipse(x, y, r1, r2) {
		this.pixi.graphic.drawEllipse(x, y, r1, r2);
	}

	drawShape(options) {
		const vals = Object.values(options);
		this.pixi.graphic.drawPolygon(vals);
	}

	lineTo(x, y) {
		this.pixi.graphic.lineTo(x, y);
	}

	moveTo(x, y) {
		this.pixi.graphic.moveTo(x, y);
	}

	remove() {
		this.pixi.graphic.parent.removeChild(this.pixi.graphic);
	}
}
