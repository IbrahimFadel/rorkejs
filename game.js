'use strict';

const game = new Rorke(800, 600, [0, 0, 0]);
game.init();

function load() {
	game.load.texture('player', 'assets/ship.png');
	game.load.texture('bullet', 'assets/lazer.png');
	game.load.texture('enemy', 'assets/enemy.png');
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

function create() {
	player = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);

	bullets = game.add.group();

	enemies = game.add.group();

	enemies.create(game.screen.width - 100, game.screen.height / 2, 'enemy');

	// bullets.create(10, 10, 'bullet');
}

function update() {
	handlePlayerMovement();
	// game.physics.collide(bullets, player2);

	if (game.physics.colliding(bullets, enemies)) {
		// enemies.destroy();
		// console.log('Colliding');
	}
}

function handlePlayerMovement() {
	if (game.input.keyIsDown('w')) {
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
