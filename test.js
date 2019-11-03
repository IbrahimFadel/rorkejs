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

let test;
let mygroup;
let player;
async function create() {
	// game.fps = 10;
	test = await game.add.sprite(
		game.width / 2,
		game.height / 2,
		"spriteTexture"
	);

	mygroup = await game.add.group();
	for (let i = 0; i < 10; i++) {
		await mygroup.create(game.width / 2, 40 * i + 40, "spriteTexture");
	}

	// await mygroup.remove(mygroup.sprites[4]);

	player = await game.add.sprite(50, 50, "playerSpritesheet");
	player.animations.add("walkUp", [0, 1, 2, 3, 4, 5, 6, 7, 8], {
		repeat: true,
		speed: 5,
	});
	player.animations.add("walkDown", [18, 19, 20, 21, 22, 23, 24, 25, 26], {
		repeat: true,
		speed: 5,
	});
	player.animations.add("walkLeft", [9, 10, 11, 12, 13, 14, 15, 16, 17], {
		repeat: true,
		speed: 5,
	});
	player.animations.add("walkRight", [27, 28, 29, 30, 31, 32, 33, 34, 35], {
		repeat: true,
		speed: 5,
	});
}

function update() {
	handlePlayerMovement();

	for (let child of mygroup.sprites) {
		child.rotateTo(player);
	}
	// player.rotateTo(mygroup.sprites[0]);
}

function handlePlayerMovement() {
	if (game.input.keyIsDown("w")) {
		player.velocity.y = -100;
		player.animations.play("walkUp");
	} else if (game.input.keyIsDown("s")) {
		player.animations.play("walkDown");
		player.velocity.y = 100;
	} else {
		player.velocity.y = 0;
		player.animations.pause("walkUp");
		player.animations.pause("walkDown");
	}
	if (game.input.keyIsDown("a")) {
		player.velocity.x = -100;
		player.animations.play("walkLeft");
	} else if (game.input.keyIsDown("d")) {
		player.velocity.x = 100;
		player.animations.play("walkRight");
	} else {
		player.animations.pause("walkLeft");
		player.animations.pause("walkRight");
		player.velocity.x = 0;
	}
}
