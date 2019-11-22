import Graphic from './Graphic';

export default class Graphics {
	constructor(rorke) {
		this.rorke = {
			rorke,
		};

		this.fillColour = 0x000000;
		this.fillAlpha = 1;
		// this.border = {
		// 	width: 0,
		// 	colour: 0x000000,
		// 	alpha: 1,
		// 	position: 1,
		// };
		this.RECT = 0;
		this.ELLIPSE = 1;
		this.SHAPE = 2;
		this.LINE = 3;
		this.MOVE = 4;
	}

	makeGraphic(type, options) {
		const newGraphic = new Graphic(
			type,
			options,
			this.fillColour,
			this.fillAlpha,
			this.border,
			this.rorke.rorke,
		);
		newGraphic.draw();
		return newGraphic;
	}

	fill(colour, alpha) {
		this.fillColour = colour;
		this.fillAlpha = alpha;
	}

	border(width, colour, alpha, position) {
		this.border.width = width;
		this.border.colour = colour || 0x000000;
		this.border.alpha = alpha || 1;
		this.border.position = position || 1;
	}

	lineTo(x, y) {
		const options = {
			x,
			y,
		};
		return this.makeGraphic(this.LINE, options);
	}

	moveTo(x, y) {
		const options = {
			x,
			y,
		};
		return this.makeGraphic(this.MOVE, options);
	}

	drawRect(x, y, width, height) {
		const options = {
			x,
			y,
			width,
			height,
		};
		return this.makeGraphic(this.RECT, options);
	}

	drawEllipse(x, y, r1, r2) {
		const options = {
			x,
			y,
			r1,
			r2,
		};
		return this.makeGraphic(this.ELLIPSE, options);
	}

	drawShape(...args) {
		const argsArr = Array.prototype.slice.call(args);
		if (argsArr.length % 2 !== 0) {
			throw new Error('Draw a shape with pairs of x,y coordinates');
		}

		const options = {};

		let count = 0;
		argsArr.forEach((arg) => {
			if (count % 2 === 0) {
				options[`x${count / 2}`] = arg;
			} else {
				options[`y${(count - 1) / 2}`] = arg;
			}
			count++;
		});
		return this.makeGraphic(this.SHAPE, options);
	}
}
