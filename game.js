'use strict';

const game = new Rorke(800, 600, [0, 0, 0]);
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
	// game.load.spritesheet('walking', 'assets/walkingSpritesheet.png', {
	// 	tileW: 64,
	// 	tileH: 64,
	// 	numTiles: 36,
	// });
}

let player;
let playerSpeed = 0;
const maxPlayerSpeed = 200;

let bullets;
const bulletSpeed = 500;
const fireRate = 5;
let fireRateInterval = 5;

let enemies;
let explosion;

function create() {
	player = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);

	explosion = game.add.sprite(0, 0, 'explosion');
	explosion.hide();
	explosion.animations.add(
		'explode',
		[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		{
			speed: 3,
		},
	);

	bullets = game.add.group();
	enemies = game.add.group();
	enemies.create(game.screen.width - 100, game.screen.height / 2, 'enemy');
	enemies.create(100, game.screen.height / 2, 'enemy');
	enemies.create(game.screen.width / 2, game.screen.height - 100, 'enemy');
	enemies.create(game.screen.width / 2, 100, 'enemy');
}

function update() {
	handlePlayerMovement();

	for (const bullet of bullets.sprites) {
		for (const enemy of enemies.sprites) {
			if (game.physics.colliding(bullet, enemy)) {
				explosion.show();
				explosion.x = enemy.x;
				explosion.y = enemy.y;
				explosion.animations.play('explode', () => {
					explosion.hide();
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
		player.angle -= 5;
	} else if (game.input.keyIsDown('right') || game.input.keyIsDown('d')) {
		player.angle += 5;
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
