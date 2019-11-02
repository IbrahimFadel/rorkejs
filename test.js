const game = new Rorke(800, 600, [105, 50, 50]);

game.start();

function load() {
	game.load.texture("spriteTexture", "assets/player.png");
}
function create() {
	game.add.sprite(game.width / 2, game.height / 2, "spriteTexture");
}
function update() {}
