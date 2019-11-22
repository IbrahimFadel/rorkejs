export default class Input {
	constructor() {
		this.keyArray = 'a b c d e f g h i j k l m n o p q r s t u v w x y z left right down up shift tab space'.split(
			' ',
		);
		this.keyEnum = {};
		this.fillKeyEnum();
		this.keyArray = new Array(this.keyEnum.length);

		this.mouseX = 0;
		this.mouseY = 0;
	}

	fillKeyEnum() {
		for (let i = 0; i < this.keyArray.length; i++) {
			this.keyEnum[this.keyArray[i]] = i;
		}
	}

	static onKeyPressed(key, fn) {
		let repeat = false;
		window.addEventListener('keyup', () => {
			repeat = false;
		});
		window.addEventListener('keydown', (e) => {
			let newKeyName;
			if (e.key === 'ArrowLeft') {
				newKeyName = 'left';
			} else if (e.key === 'ArrowRight') {
				newKeyName = 'right';
			} else if (e.key === 'ArrowUp') {
				newKeyName = 'up';
			} else if (e.key === 'ArrowDown') {
				newKeyName = 'down';
			} else {
				newKeyName = e.key;
			}
			if (!repeat && newKeyName === key) {
				repeat = true;
				const callbackObject = {
					key,
					code: e.keyCode,
				};
				fn(callbackObject);
			}
		});
	}

	keyIsDown(key) {
		window.addEventListener('keydown', (e) => {
			this.keyDownHelper(e, key);
		});
		window.addEventListener('keyup', (e) => {
			this.keyUpHelper(e, key);
		});
		return this.keyArray[this.keyEnum[key]];
	}

	keyDownHelper(e, key) {
		let newKeyName;
		if (e.key === 'ArrowLeft') {
			newKeyName = 'left';
		} else if (e.key === 'ArrowRight') {
			newKeyName = 'right';
		} else if (e.key === 'ArrowUp') {
			newKeyName = 'up';
		} else if (e.key === 'ArrowDown') {
			newKeyName = 'down';
		} else if (e.key === ' ') {
			newKeyName = 'space';
		} else {
			newKeyName = e.key;
		}
		if (newKeyName === key) this.keyArray[this.keyEnum[key]] = true;
	}

	keyUpHelper(e, key) {
		let newKeyName;
		if (e.key === 'ArrowLeft') {
			newKeyName = 'left';
		} else if (e.key === 'ArrowRight') {
			newKeyName = 'right';
		} else if (e.key === 'ArrowUp') {
			newKeyName = 'up';
		} else if (e.key === 'ArrowDown') {
			newKeyName = 'down';
		} else if (e.key === ' ') {
			newKeyName = 'space';
		} else {
			newKeyName = e.key;
		}
		if (newKeyName === key) this.keyArray[this.keyEnum[key]] = false;
	}
}
