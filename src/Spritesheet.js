import Texture from "./Texture";

export default class Spritesheet {
	constructor(name, path, options, rorke) {
		this.rorke = {
			textures: rorke.textures,
			rorke: rorke,
			spritesheetsLoaded: rorke.spritesheetsLoaded,
		};

		this.name = name;
		this.path = path;
		this.options = options;
		this.tileW = this.options.tileW;
		this.tileH = this.options.tileH;
		this.tiles = this.options.tiles;
		this.imageW = undefined;
		this.imageH = undefined;

		this.textures = [];
	}

	async load(callback) {
		if (Object.keys(this.options).length < 3)
			throw "Specify tileW, tileH, and tiles when loading spritesheets";

		const spritesheetImage = new Image();
		spritesheetImage.src = this.path;
		spritesheetImage.onerror = () => {
			throw "Something went wrong loading a spritesheet. Make sure the path is correct";
		};
		spritesheetImage.onload = async () => {
			await this.splitImages(spritesheetImage, textures => {
				this.textures = textures;
				callback(textures);
			});
		};
	}

	async splitImages(img, callback) {
		let textures = [];
		this.imageW = img.naturalWidth;
		this.imageH = img.naturalHeight;
		const maxInRow = parseInt(this.imageW / this.tileW);
		let col = 0;
		let xCount = 0;

		for (let i = 0; i < this.tiles; i++) {
			if (i % maxInRow === 0 && i != 0) {
				xCount = 0;
				col++;
			}
			const x1 = xCount * this.tileW;
			const y1 = col * this.tileH;
			const tile = new Image(),
				can = document.createElement("canvas"),
				ctx = can.getContext("2d");
			can.width = this.tileW;
			can.height = this.tileH;
			tile.src = this.path;
			tile.onload = async () => {
				ctx.drawImage(
					tile,
					x1,
					y1,
					this.tileW,
					this.tileH,
					0,
					0,
					this.tileW,
					this.tileH
				);
				const imgUrl = can.toDataURL();
				const newTexture = new Texture(this.name + i, imgUrl, this.rorke.rorke);
				await newTexture.load();
				textures.push(newTexture);
				if (i === this.tiles - 1) {
					this.rorke.spritesheetsLoaded++;
					callback(textures);
				}
			};
			xCount++;
		}
	}

	async setTextures(textures) {
		this.textures = textures;
	}
}
