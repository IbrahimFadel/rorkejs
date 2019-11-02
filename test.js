const game = new Rorke(800, 600, [105, 50, 50]);

game.start();

function load() {
	game.load.texture("spriteTexture", "assets/player.png");
}

let player;
let mygroup;
async function create() {
	game.fps = 100;
	player = await game.add.sprite(
		game.width / 2,
		game.height / 2,
		"spriteTexture"
	);

	mygroup = await game.add.group();
	for (let i = 0; i < 10; i++) {
		await mygroup.create(game.width / 2, 40 * i + 40, "spriteTexture");
	}

	await mygroup.remove(mygroup.sprites[4]);
}
function update() {
	if (game.input.keyIsDown("w")) {
		player.velocity.y = -100;
	} else if (game.input.keyIsDown("s")) {
		player.velocity.y = 100;
	} else {
		player.velocity.y = 0;
	}
	if (game.input.keyIsDown("a")) {
		player.velocity.x = -100;
	} else if (game.input.keyIsDown("d")) {
		player.velocity.x = 100;
	} else {
		player.velocity.x = 0;
	}
	// player.x += 1;
	// player.angle += 0.1;
	// mygroup.angle += 0.01;
	// mygroup.x += 1;
	// for (let child of mygroup.sprites) {
	// child.x += 1;
	// child.angle += 0.1;
	// }
}
