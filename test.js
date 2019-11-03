//@ts-ignore
const game = new Rorke(800, 600, [105, 50, 50]);

game.start();

async function load() {
	await game.load.texture("spriteTexture", "assets/player.png");
	await game.load.spritesheet(
		"playerSpritesheet",
		"assets/walkingSpritesheet.png",
		{
			tileW: 64,
			tileH: 64,
			tiles: 36,
		}
	);
}

let player;
let mygroup;
let playerAnimationsSprite;
async function create() {
	game.fps = 10;
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

	playerAnimationsSprite = await game.add.sprite(50, 50, "playerSpritesheet");
	playerAnimationsSprite.animations.add("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], {
		repeat: true,
		speed: 1,
	});
	playerAnimationsSprite.animations.play("walkUp");
	// playerAnimationsSprite.animations.remove("walkUp");
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
}
