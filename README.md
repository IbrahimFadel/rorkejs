# RorkeJS

This is a simple game framework inspired by Phaser. It uses the Pixi WebGL renderer to make browser games.

## Usage

Using this framework is pretty simple. Essentially there are three stages to the game: load, create, and update. Load runs once at the start of the game, use it to load assets like spritesheets and textures. Create runs once, right after load. Update gets called every frame.

Check out `game.js` in this repository for an example of a simple game made with this framework.

Here's how you initialize your game. You can specify the canvas size, background color, and the functions to run for each three stages (in this case, i just kept them as load, create, and update).
```js
const game = new Rorke(768, 758, [0, 0, 0], {
	load,
	create,
	update,
});
game.init();
```
