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
function create() {
	player1 = game.add.sprite(
		game.screen.width / 2 - 500,
		game.screen.height / 2 + 300,
		'player',
	);

	player2 = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);

	player2.mass = 500;

	player1.velocity.x = 150;
	player1.velocity.y = -80;
}

function update() {
	game.physics.collide(player1, player2);
}
