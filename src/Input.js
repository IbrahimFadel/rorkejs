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

	onKeyPressed(key, fn) {
		let repeat = false;
		window.addEventListener('keyup', () => {
			repeat = false;
		});
		window.addEventListener('keydown', event => {
			let newKeyName;
			if (event.key === 'ArrowLeft') {
				newKeyName = 'left';
			} else if (event.key === 'ArrowRight') {
				newKeyName = 'right';
			} else if (event.key === 'ArrowUp') {
				newKeyName = 'up';
			} else if (event.key === 'ArrowDown') {
				newKeyName = 'down';
			} else {
				newKeyName = event.key;
			}
			if (!repeat && newKeyName === key) {
				repeat = true;
				const callbackObject = {
					key: key,
					code: event.key,
				};
				fn(callbackObject);
			}
		});
	}

	keyIsDown(key) {
		window.addEventListener('keydown', event => {
			this.keyDownHelper(event, key);
		});
		window.addEventListener('keyup', event => {
			this.keyUpHelper(event, key);
		});
		return this.keyArray[this.keyEnum[key]];
	}

	keyDownHelper(event, key) {
		let newKeyName;
		if (event.key === 'ArrowLeft') {
			newKeyName = 'left';
		} else if (event.key === 'ArrowRight') {
			newKeyName = 'right';
		} else if (event.key === 'ArrowUp') {
			newKeyName = 'up';
		} else if (event.key === 'ArrowDown') {
			newKeyName = 'down';
		} else if (event.key === ' ') {
			newKeyName = 'space';
		} else {
			newKeyName = event.key;
		}
		if (newKeyName === key) this.keyArray[this.keyEnum[key]] = true;
	}

	keyUpHelper(event, key) {
		let newKeyName;
		if (event.key === 'ArrowLeft') {
			newKeyName = 'left';
		} else if (event.key === 'ArrowRight') {
			newKeyName = 'right';
		} else if (event.key === 'ArrowUp') {
			newKeyName = 'up';
		} else if (event.key === 'ArrowDown') {
			newKeyName = 'down';
		} else if (event.key === ' ') {
			newKeyName = 'space';
		} else {
			newKeyName = event.key;
		}
		if (newKeyName === key) this.keyArray[this.keyEnum[key]] = false;
	}
}
