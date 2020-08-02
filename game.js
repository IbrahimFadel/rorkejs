'use strict';

const game = new Rorke(768, 758, [0, 0, 0], {
	load,
	create,
	update,
});
game.init();

function load() {
	game.load.texture('player', 'assets/ship.png');
	game.load.texture('bullet', 'assets/lazer.png');
	game.load.texture('enemy', 'assets/enemy.png');
	game.load.texture('starfield', 'assets/deep-space.jpg');
	game.load.spritesheet('explosion', 'assets/explode.png', {
		tileW: 128,
		tileH: 128,
		numTiles: 16,
	});
}

let player;
let playerSpeed = 0;
const maxPlayerSpeed = 200;
let playerDead = false;

let bullets;
const bulletSpeed = 500;
const fireRate = 5;
let fireRateInterval = 5;

let enemies;
const enemyVelocity = 50;
let enemyBulletsArray = [];
let enemyFireRateIntervals = [];
const enemyFireRate = 100;
const enemyBulletSpeed = 200;

let explosions;

const NUM_STARS = 20;

function create() {
	const background = game.setBackground('starfield');
	background.width = game.screen.width;
	background.height = game.screen.height;

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

	for(const _ of enemies.sprites) {
		enemyBulletsArray.push(game.add.group());
		enemyFireRateIntervals.push(0);
	}
}

function update() {
	handlePlayerMovement();
	handleEnemyMovement();
	handleEnemyShooting();
	handleBulletCollision();
}

function handleEnemyShooting(enemy, i) {
	if (enemyFireRateIntervals[i] === enemyFireRate) {
		const bullet = enemyBulletsArray[i].create(enemy.x, enemy.y, 'bullet');
		bullet.angle = enemy.angle;
		bullet.moveForward(enemyBulletSpeed);
		bullet.angle += 90;

		enemyFireRateIntervals[i] = 0;
	}

	enemyFireRateIntervals[i]++;
}

function handleEnemyMovement() {
	let i = 0;
	for(const enemy of enemies.sprites) {
		enemy.lookAt(player);

		if(game.dist(enemy, player) > 150) {
			enemy.moveForward(enemyVelocity);
		}
		else {
			enemy.velocity.x = 0;
			enemy.velocity.y = 0;
		}

		handleEnemyShooting(enemy, i);

		enemy.angle += 90;

		i++;
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

function handleBulletCollision() {
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

	if(playerDead) return;
	for(const enemyBullets of enemyBulletsArray) {
		for (const bullet of enemyBullets.sprites) {
			if (game.physics.colliding(bullet, player)) {
				const explosion = explosions.create(player.x, player.y, 'explosion');
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

				player.kill();
				bullet.kill();
				playerDead = true;
			}
		}
	}
}