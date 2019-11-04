import { Graphics } from "pixi.js";

export default class Graphic {
	constructor(type, options, fillColour, border, rorke) {
		this.pixi = {
			graphic: new Graphics(),
		};
		this.rorke = {
			app: rorke.pixi.app,
		};
		this.fillColour = fillColour;
		this.type = type;
		this.options = options;
		this.border = border;
	}

	draw() {
		this.rorke.app.stage.addChild(this.pixi.graphic);
		this.pixi.graphic.beginFill(this.fillColour);
		const { width, colour, alpha, position } = this.border;
		this.pixi.graphic.lineStyle(width, colour, alpha, position);
		if (this.type === 0) {
			const { x, y, width, height } = this.options;
			this.drawRect(x, y, width, height);
		} else if (this.type === 1) {
			const { x, y, r1, r2 } = this.options;
			this.drawEllipse(x, y, r1, r2);
		} else if (this.type === 2) {
			this.drawShape(this.options);
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
		// let coords = [];
		// let coord = [];
		// let count = 0;
		// const vals = Object.values(options);
		// for (let val of vals) {
		// 	if (count % 2 === 0 && count !== 0) {
		// 		coords.push(coord);
		// 		coord = [];
		// 	}
		// 	coord.push(val);
		// 	count++;
		// 	if (count === vals.length - 1) {
		// 		coords.push(coord);
		// 		continue;
		// 	}
		// }
		// console.log(coords);
		// for (let i = 0; i < coords.length; i++) {
		// 	const coord = coords[i];
		// 	const x = coord[0];
		// 	const y = coord[1];
		// 	this.pixi.graphic.moveTo(x, y);
		// 	if (i < coords.length - 1) {
		// 		this.pixi.graphic.lineTo(coords[i + 1][0], coords[i + 1][1]);
		// 	} else {
		// 	}
		// }
	}

	remove() {
		this.pixi.graphic.parent.removeChild(this.pixi.graphic);
	}
}
