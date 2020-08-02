'use strict';

/**
 * Physics class
 *
 * @class Physics
 */
export default class Physics {
	/**
	 * Collide two sprites
	 * @param {Sprite} sprite1 Sprite1
	 * @param {Sprite} sprite2 Sprite2
	 */
	collide(sprite1, sprite2) {
		const colliding = this.colliding(sprite1, sprite2);

		if (colliding) {
			this.transferVelocity(sprite1, sprite2);
		}
	}

	/**
	 * Check if two sprites are colliding
	 * @param {Sprite} sprite1 Sprite1
	 * @param {Sprite} sprite2 Sprite2
	 */
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
			return (
				ab.x + ab.width > bb.x &&
				ab.x < bb.x + bb.width &&
				ab.y + ab.height > bb.y &&
				ab.y < bb.y + bb.height
			);
		}

		return false;
	}

	/**
	 * When a collision takes place, velocities of sprites get transfered
	 * @param {Sprite} sprite1 Sprite1
	 * @param {Sprite} sprite2 Sprite2
	 */
	transferVelocity(sprite1, sprite2) {
		const m1 = sprite1.mass;
		const v1 = sprite1.velocity;
		const m2 = sprite2.mass;
		// const v2 = sprite2.velocity;

		const vf1X = ((m1 - m2) * v1.x) / (m1 + m2);
		const vf2X = (2 * m1 * v1.x) / (m1 + m2);

		const vf1Y = ((m1 - m2) * v1.y) / (m1 + m2);
		const vf2Y = (2 * m1 * v1.y) / (m1 + m2);

		sprite1.velocity.x = vf1X;
		sprite2.velocity.x = vf2X;

		sprite1.velocity.y = vf1Y;
		sprite2.velocity.y = vf2Y;
	}
}
