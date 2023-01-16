module.exports = {
	entry: './src/main.ts',
	mode: "production",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			"fs": false,
			"os": false,
			"http": false,
			"path": false
		},
	},
	output: {
		filename: 'main.js',
		path: `${process.cwd()}/dist`,
	}
};
