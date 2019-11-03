import Texture from "./Texture";

export default class Spritesheet {
	constructor(name, path, options, rorke) {
		this.rorke = {
			textures: rorke.textures,
			rorke: rorke
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

	async load() {
		if (Object.keys(this.options).length < 3)
			throw "Specify tileW, tileH, and tiles when loading spritesheets";

		const spritesheetImage = new Image();
		spritesheetImage.src = this.path;
		spritesheetImage.onerror = () => {
			throw "Something went wrong loading a spritesheet. Make sure the path is correct";
		};
		spritesheetImage.onload = async () => {
			await this.splitImages(spritesheetImage);
		};

		//! THIS IS MESSY I HATE IT
		//! PLEASE FIND A SOLUTION!!!!!!
		const areTexturesLoaded = setInterval(() => {
			if (this.textures.length > 0) {
				clearInterval(areTexturesLoaded);
			}
		}, 1);
	}

	async splitImages(img) {
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
			const tile = await createImageBitmap(img, x1, y1, this.tileW, this.tileH);
			const can = document.createElement("canvas");
			can.width = tile.width;
			can.height = tile.height;
			const ctx = can.getContext("2d");
			ctx.drawImage(tile, 0, 0);
			can.toBlob(async blob => {
				const url = URL.createObjectURL(blob);
				const newTexture = new Texture(this.name + i, url, this.rorke.rorke);
				await newTexture.load();
				textures.push(newTexture);
				this[this.name + i] = newTexture;
				if (i === this.tiles - 1) {
					await this.setTextures(textures);
				}
			});
			xCount++;
		}
	}

	async setTextures(textures) {
		this.textures = textures;
	}
}
