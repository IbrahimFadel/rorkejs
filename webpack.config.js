const path = require("path");
const dev = true;

module.exports = {
	entry: "./src/Rorke.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "rorke.js"
	},
	mode: "development",
	devtool: dev ? "eval-cheap-module-source-map" : "source-map"
};
