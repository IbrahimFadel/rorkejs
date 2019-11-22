import Sprite from './Sprite';

export default class Physics {
	constructor(rorke) {
		this.rorke = {
			sprites: rorke.sprites,
			groups: rorke.groups,
			rorke,
		};

		this.SET_WORLD_BOUNDS = 'WORLD_BOUNDS';
	}

	collide(sprite1, sprite2, cb) {
		const ab = sprite1.pixi.sprite.getBounds();
		const bb = sprite2.pixi.sprite.getBounds();
		if (
			ab.x + ab.width > bb.x
			&& ab.x < bb.x + bb.width
			&& ab.y + ab.height > bb.y
			&& ab.y < bb.y + bb.height
		) {
			if (cb !== undefined) cb();
			else {
				this.transferVelocity(sprite1, sprite2);

				return (
					ab.x + ab.width > bb.x
					&& ab.x < bb.x + bb.width
					&& ab.y + ab.height > bb.y
					&& ab.y < bb.y + bb.height
				);
			}
		} else {
			return (
				ab.x + ab.width > bb.x
				&& ab.x < bb.x + bb.width
				&& ab.y + ab.height > bb.y
				&& ab.y < bb.y + bb.height
			);
		}
	}

	setWorldBounds(x, y, width, height) {
		const newSprite = new Sprite(x, y, this.SET_WORLD_BOUNDS, this.rorke.rorke);
		// for(let sprite of this.rorke.sprites) {

		// }
	}

	transferVelocity(sprite1, sprite2) {
		// (v1 x m1) - (v2 x m2) = VF x MT
		// MT = m1 + m2
		// VF = ((v1 x m1) - (v2 x m2) / MT) = VF

		const vx1 = sprite1.velocity.x;
		const vy1 = sprite1.velocity.y;
		const vx2 = sprite2.velocity.x;
		const vy2 = sprite2.velocity.y;
		const m1 = sprite1.mass;
		const m2 = sprite2.mass;

		const massTotal = m1 + m2;
		const velocityFinalx = (vx1 * m1 - vx2 * m2) / massTotal;
		const velocityFinaly = (vy1 * m1 - vy2 * m2) / massTotal;
		console.log(vx1, vx2, velocityFinalx);

		sprite1.velocity.x = velocityFinalx;
		sprite2.velocity.x = velocityFinalx;
		sprite1.velocity.y = velocityFinaly;
		sprite2.velocity.y = velocityFinaly;

		// const vx1 = sprite1.velocity.x,
		// 	vy1 = sprite1.velocity.y;
		// const vx2 = sprite2.velocity.x,
		// 	vy2 = sprite2.velocity.y;
		// const m1 = sprite1.mass,
		// 	m2 = sprite2.mass;

		// const px = (m1 + m2) * (vx1 + vx2);
		// const py = (m1 + m2) * (vy1 + vy2);

		// sprite1.velocity.x = px;
		// sprite2.velocity.x = px;
		// sprite1.velocity.y = py;
		// sprite2.velocity.y = py;
	}
}
