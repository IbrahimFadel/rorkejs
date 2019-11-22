//@ts-ignore
const game = new Rorke(800, 600, [105, 50, 50]);

game.start();

async function load() {
	await game.load.texture('spriteTexture', 'assets/player.png');
	await game.load.spritesheet(
		'playerSpritesheet',
		'assets/walkingSpritesheet.png',
		{
			tileW: 64,
			tileH: 64,
			tiles: 36,
		}
	);
}

// let test;
let mygroup;
let player;
let text;
let child1, child2;
async function create() {
	game.physics.setWorldBounds(0, 0, game.width, game.height);
	// game.fps = 1;
	text = game.add.text(0, 50, 'Hello, World!', {
		fontFamily: 'Arial',
		fontSize: 24,
		fill: 0xff1010,
		align: 'center',
	});

	mygroup = await game.add.group();
	child1 = await mygroup.create(
		game.width / 2,
		game.height / 2 - 60,
		'spriteTexture'
	);
	child2 = await mygroup.create(
		game.width / 2,
		game.height / 2,
		'spriteTexture'
	);
	// for (let i = 0; i < 10; i++) {
	// 	const child = await mygroup.create(
	// 		game.width / 2,
	// 		50 * i + 40,
	// 		"spriteTexture"
	// 	);
	// 	child.mass = 0.5;
	// 	let randNumx = Math.floor(Math.random() * 3) + 1;
	// 	let randNumy = Math.floor(Math.random() * 3) + 1;
	// 	const randx = Math.random();
	// 	const randy = Math.random();
	// 	if (randx < 0.5) {
	// 		randNumx = -randNumx;
	// 	}
	// 	if (randy < 0.5) {
	// 		randNumy = -randNumy;
	// 	}
	// 	child.velocity.x = 50 * randNumx;
	// 	child.velocity.y = 50 * randNumy;
	// }

	player = await game.add.sprite(50, 50, 'playerSpritesheet');
	player.set.scale(0.5);
	player.mass = 1;
	player.animations.add('walkUp', [0, 1, 2, 3, 4, 5, 6, 7, 8], {
		repeat: true,
		speed: 5,
	});
	player.animations.add('walkDown', [18, 19, 20, 21, 22, 23, 24, 25, 26], {
		repeat: true,
		speed: 5,
	});
	player.animations.add('walkLeft', [9, 10, 11, 12, 13, 14, 15, 16, 17], {
		repeat: true,
		speed: 5,
	});
	player.animations.add('walkRight', [27, 28, 29, 30, 31, 32, 33, 34, 35], {
		repeat: true,
		speed: 5,
	});

	// game.camera.follow(player, true, true);
	// game.camera.padding = {
	// 	x: 50,
	// 	y: 50,
	// };
}

function update() {
	// const arr = [1, 2, 3, 4, 5];
	// const i = arr.indexOf(3);
	// console.log(arr.splice(i, 1));
	// console.log(arr.slice(i + 1, -1), arr.slice(i));
	player.showHitBox();
	child1.showHitBox();
	child2.showHitBox();

	game.physics.collide(player, child1);
	game.physics.collide(player, child2);

	// game.physics.collide(player, mygroup.sprites[0], () => {
	// 	console.log("collided!");
	// });
	// game.physics.collide(player, mygroup.sprites[1]);
	text.x += 1;
	text.angle += 0.1;
	handlePlayerMovement();

	// for (let child of mygroup.sprites) {
	// 	if (child.x <= 5 || child.x >= game.width - 5)
	// 		child.velocity.x = -child.velocity.x;
	// 	if (child.y <= 5 || child.y >= game.height - 5)
	// 		child.velocity.y = -child.velocity.y;
	// 	// else if(child.x >= game.width - 5) child.velocity.
	// 	child.rotateTo(player);
	// 	child.showHitBox();
	// 	const copy = [...mygroup.sprites];
	// 	const i = copy.indexOf(child);
	// 	copy.splice(i, 1);
	// 	for (let other of copy) {
	// 		game.physics.collide(child, other);
	// 	}
	// 	// const allButChild = copy.slice(i + 1, 0).concat(copy.slice(i));
	// 	// console.log(allButChild);
	// 	// for (let other of allButChild) {
	// 	// game.physics.collide(child, other);
	// 	// }
	// }
	// mygroup.sprites[0].moveTo(player, 50);
}

function handlePlayerMovement() {
	// player.velocity.x = 50;
	// player.velocity.y = 50;
	// if (player.x <= 5 || player.x >= game.width - 5)
	// 	player.velocity.x = -player.velocity.x;
	// if (player.y <= 5 || player.y >= game.height - 5)
	// 	player.velocity.y = -player.velocity.y;
	// if (player.x < 15 || player.x > game.width - 15)
	// player.velocity.x = -player.velocity.x;
	// if (player.y < 15 || player.y > game.height - 15)
	// player.velocity.y = -player.velocity.y;
	if (game.input.keyIsDown('w')) {
		player.velocity.y = -100;
		player.animations.play('walkUp');
	} else if (game.input.keyIsDown('s')) {
		player.animations.play('walkDown');
		player.velocity.y = 100;
	} else {
		player.velocity.y = 0;
		player.animations.pause('walkUp');
		player.animations.pause('walkDown');
	}
	if (game.input.keyIsDown('a')) {
		player.velocity.x = -100;
		player.animations.play('walkLeft');
	} else if (game.input.keyIsDown('d')) {
		player.velocity.x = 100;
		player.animations.play('walkRight');
	} else {
		player.animations.pause('walkLeft');
		player.animations.pause('walkRight');
		player.velocity.x = 0;
	}
}
