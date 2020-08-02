'use strict';

const game = new Rorke(800, 600, [0, 0, 0], {
	load,
	create,
	update,
});
game.init();

function load() {
	game.load.texture('player', 'assets/ship.png');
	game.load.texture('bullet', 'assets/lazer.png');
	game.load.texture('enemy', 'assets/enemy.png');
	game.load.spritesheet('explosion', 'assets/explode.png', {
		tileW: 128,
		tileH: 128,
		numTiles: 16,
	});
}

let player;
let playerSpeed = 0;
const maxPlayerSpeed = 200;

let bullets;
const bulletSpeed = 500;
const fireRate = 5;
let fireRateInterval = 5;

let enemies;
let explosions;

function create() {
	player = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);

	explosions = game.add.group();

	bullets = game.add.group();
	enemies = game.add.group();
	enemies.create(game.screen.width - 100, game.screen.height / 2, 'enemy');
	enemies.create(100, game.screen.height / 2, 'enemy');
	enemies.create(game.screen.width / 2, game.screen.height - 100, 'enemy');
	enemies.create(game.screen.width / 2, 100, 'enemy');
	enemies.create(500, game.screen.height / 2, 'enemy');
}

function update() {
	handlePlayerMovement();

	for (const bullet of bullets.sprites) {
		for (const enemy of enemies.sprites) {
			if (game.physics.colliding(bullet, enemy)) {
				const explosion = explosions.create(enemy.x, enemy.y, 'explosion');
				explosion.animations.add(
					'explode',
					[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
					{
						speed: 3,
					},
				);

				explosion.animations.play('explode', () => {
					explosions.remove(explosion);
				});
				enemy.kill();
				bullet.kill();
			}
		}
	}
}

function handlePlayerMovement() {
	if (game.input.keyIsDown('w') || game.input.keyIsDown('up')) {
		if (playerSpeed < maxPlayerSpeed) playerSpeed += 5;
		player.moveForward(playerSpeed);
	} else {
		if (playerSpeed - 5 < 0) {
			playerSpeed = 0;
		} else if (playerSpeed > 0) {
			playerSpeed -= 5;
			player.moveForward(playerSpeed);
		}
	}

	if (game.input.keyIsDown('left') || game.input.keyIsDown('a')) {
		player.angle -= 2;
	} else if (game.input.keyIsDown('right') || game.input.keyIsDown('d')) {
		player.angle += 2;
	}

	if (game.input.keyIsDown('space')) {
		if (fireRateInterval === fireRate) {
			const bullet = bullets.create(player.x, player.y, 'bullet');
			bullet.angle = player.angle;
			bullet.moveForward(bulletSpeed);
			bullet.angle += 90;

			fireRateInterval = 0;
		}

		fireRateInterval++;
	}
}
