import { Text as PixiText, TextStyle } from 'pixi.js';

/**
 * Rorke Text
 * @example
 *
 * let plainText;
 * let styledText;
 * async function create() {
 * 	plainText = game.add.text(100, 100, "Plain!");
 *  	styledText = game.add.text(game.width / 2, game.height / 2, "Hello, World", {
		fontFamily: 'Arial',
		fontSize: 24,
		fill: 0xff1010,
		align: 'center',
	})
 * }
 *
 * @param {Number} x x value
 * @param {Number} y y value
 * @param {String} text text
 * @param {Object} options options(styling)
 * @param {Object} rorke game instance
 */
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

	/**
	 * Create a new pixi text(with styling if needed) and add it to the game
	 */
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

	/**
	 * Update x and y pixi values according to x and y rorke values
	 */
	updatePos() {
		this.pixi.text.x = this.x;
		this.pixi.text.y = this.y;
	}

	/**
	 * Update angle pixi value according to angle rorke value
	 */
	updateRot() {
		this.pixi.text.angle = this.angle;
	}

	/**
	 * Update all pixi values according to rorke values
	 */
	update() {
		this.updatePos();
		this.updateRot();
	}
}
