import Graphic from "./Graphic";

export default class Graphics {
	constructor(rorke) {
		this.rorke = {
			rorke: rorke,
		};

		this.fillColour = 0x000000;
		// this.border = {
		// 	width: 0,
		// 	colour: 0x000000,
		// 	alpha: 1,
		// 	position: 1,
		// };
		this.RECT = 0;
		this.ELLIPSE = 1;
		this.SHAPE = 2;
	}

	makeGraphic(type, options) {
		const newGraphic = new Graphic(
			type,
			options,
			this.fillColour,
			this.border,
			this.rorke.rorke
		);
		newGraphic.draw();

		return newGraphic;
	}

	fill(colour) {
		this.fillColour = colour;
	}

	border(width, colour, alpha, position) {
		this.border.width = width;
		this.border.colour = colour || 0x000000;
		this.border.alpha = alpha || 1;
		this.border.position = position || 1;
	}

	drawRect(x, y, width, height) {
		const options = {
			x: x,
			y: y,
			width: width,
			height: height,
		};
		return this.makeGraphic(this.RECT, options);
	}

	drawEllipse(x, y, r1, r2) {
		const options = {
			x: x,
			y: y,
			r1: r1,
			r2: r2,
		};
		return this.makeGraphic(this.ELLIPSE, options);
	}

	drawShape(...args) {
		args = Array.prototype.slice.call(args);
		if (args.length % 2 !== 0)
			throw "Draw a shape with pairs of x,y coordinates";

		let options = {};

		let count = 0;
		for (let arg of args) {
			if (count % 2 === 0) {
				options[`x${count / 2}`] = arg;
			} else {
				options[`y${(count - 1) / 2}`] = arg;
			}

			count++;
		}

		console.log(options);

		return this.makeGraphic(this.SHAPE, options);
	}
}
