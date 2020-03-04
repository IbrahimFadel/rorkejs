const path = require('path');
const production = false;

module.exports = {
	entry: {
		bundle: './src/Rorke.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'rorke.[name].js',
	},
	mode: 'development',
	devtool: production ? 'source-map' : 'eval-cheap-module-source-map',
};
