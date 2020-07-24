'use strict';

const game = new Rorke(800, 600, [190, 145, 145]);
game.init();

function load() {
	game.load.texture('player', 'assets/player.png');
	game.load.spritesheet('walking', 'assets/walkingSpritesheet.png', {
		tileW: 64,
		tileH: 64,
		numTiles: 36,
	});
}

let player1;
let player2;
let walker;
function create() {
	// player1 = game.add.sprite(
	// 	game.screen.width / 2 - 500,
	// 	game.screen.height / 2 + 300,
	// 	'player',
	// );
	player2 = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);
	// player2.mass = 500;
	// player1.velocity.x = 150;
	// player1.velocity.y = -80;
	walker = game.add.sprite(50, 50, 'walking');

	walker.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7, 8], {
		speed: 5,
		repeat: true,
	});

	walker.animations.add('left', [9, 10, 11, 12, 13, 14, 15, 16, 17], {
		speed: 5,
		repeat: true,
	});

	walker.animations.add('down', [18, 19, 20, 21, 22, 23, 24, 25, 26], {
		speed: 5,
		repeat: true,
	});

	walker.animations.add('right', [27, 28, 29, 30, 31, 32, 33, 34, 35], {
		speed: 5,
		repeat: true,
	});
}

function update() {
	handlePlayerMovement();
	game.physics.collide(walker, player2);
	// if (game.physics.colliding(player1, player2)) {
	// 	console.log('Collision!');
	// }
}

function handlePlayerMovement() {
	if (game.input.keyIsDown('a')) {
		walker.velocity.x = -150;
		walker.animations.play('left');
	} else if (game.input.keyIsDown('d')) {
		walker.velocity.x = 150;
		walker.animations.play('right');
	} else {
		walker.velocity.x = 0;
		walker.animations.pause('left');
		walker.animations.pause('right');
	}

	if (game.input.keyIsDown('w')) {
		walker.velocity.y = -150;
		walker.animations.play('up');
	} else if (game.input.keyIsDown('s')) {
		walker.velocity.y = 150;
		walker.animations.play('down');
	} else {
		walker.velocity.y = 0;
		walker.animations.pause('up');
		walker.animations.pause('down');
	}
}
