'use strict';

export default class Physics {
	collide(sprite1, sprite2) {
		const colliding = this.colliding(sprite1, sprite2);

		if (colliding) {
			this.transferVelocity(sprite1, sprite2);
		}
	}

	colliding(sprite1, sprite2) {
		if (sprite1.isGroup && sprite2.isGroup) {
			for (const sprite1s of sprite1.sprites) {
				for (const sprite2s of sprite2.sprites) {
					const ab = sprite1s.getBounds();
					const bb = sprite2s.getBounds();
					const colliding =
						ab.x + ab.width > bb.x &&
						ab.x < bb.x + bb.width &&
						ab.y + ab.height > bb.y &&
						ab.y < bb.y + bb.height;

					if (colliding) return colliding;
				}
			}
		} else {
			const ab = sprite1.getBounds();
			const bb = sprite2.getBounds();
			const colliding =
				ab.x + ab.width > bb.x &&
				ab.x < bb.x + bb.width &&
				ab.y + ab.height > bb.y &&
				ab.y < bb.y + bb.height;

			return colliding;
		}

		return false;
	}

	transferVelocity(sprite1, sprite2) {
		const m1 = sprite1.mass;
		const v1 = sprite1.velocity;
		const m2 = sprite2.mass;
		const v2 = sprite2.velocity;

		const vf1_x = ((m1 - m2) * v1.x) / (m1 + m2);
		const vf2_x = (2 * m1 * v1.x) / (m1 + m2);

		const vf1_y = ((m1 - m2) * v1.y) / (m1 + m2);
		const vf2_y = (2 * m1 * v1.y) / (m1 + m2);

		sprite1.velocity.x = vf1_x;
		sprite2.velocity.x = vf2_x;

		sprite1.velocity.y = vf1_y;
		sprite2.velocity.y = vf2_y;
	}
}
