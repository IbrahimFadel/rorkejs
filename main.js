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

let player;
function create() {
	player = game.add.sprite(
		game.screen.width / 2,
		game.screen.height / 2,
		'player',
	);
}

function update() {}
