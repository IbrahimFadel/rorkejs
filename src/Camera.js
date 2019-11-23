export default class Camera {
	constructor(rorke) {
		this.rorke = {
			sprites: rorke.sprites,
			groups: rorke.groups,
			rorke,
		};
		this.padding = {
			x: 0,
			y: 0,
		};
		this.followSpeed = {
			x: 30,
			y: 30,
		};
		this.followTarget = undefined;
		this.followX = false;
		this.followY = false;
	}

	follow(target, x, y) {
		this.followTarget = target;
		// if ((x !== true && x !== false) || (y !== true && y !== false))
		// throw "Specify follow directions in true/false for x/y";
		this.followX = x;
		this.followY = y;
	}

	handleFollowCalculations() {
		let moveSpritesRight = false;
		let moveSpritesLeft = false;
		let moveSpritesUp = false;
		let moveSpritesDown = false;

		if (this.followTarget === undefined) return;
		if (this.followX) {
			if (this.followTarget.x >= this.rorke.rorke.width / 2 + this.padding.x) {
				// console.log("left");
				moveSpritesRight = true;
				moveSpritesLeft = false;
			} else if (
				this.followTarget.x <
				this.rorke.rorke.width / 2 - this.padding.x
			) {
				// console.log("right");
				moveSpritesRight = false;
				moveSpritesLeft = true;
			} else {
				moveSpritesRight = false;
				moveSpritesLeft = false;
			}
		}

		if (this.followY) {
			if (this.followTarget.y >= this.rorke.rorke.height / 2 + this.padding.y) {
				moveSpritesUp = true;
				moveSpritesDown = false;
			} else if (
				this.followTarget.y <
				this.rorke.rorke.height / 2 - this.padding.y
			) {
				moveSpritesUp = false;
				moveSpritesDown = true;
			} else {
				moveSpritesUp = false;
				moveSpritesDown = false;
			}
		}
		return {
			left: moveSpritesLeft,
			right: moveSpritesRight,
			up: moveSpritesUp,
			down: moveSpritesDown,
		};
	}
}
