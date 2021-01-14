const path = require('path');

module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/theme/_globals.scss";`,
			},
		},
	},
	configureWebpack: {
		module: {
			rules: [
				{
					test: /\.html$/i,
					include: [
						path.resolve(__dirname, "src/assets")
					],
					loader: 'html-loader',
				}
			]
		},
		output: {
			filename: '[name].[hash].js'
		}
	},
	publicPath: '',
	chainWebpack: (config) => {
		if (process.env.NODE_ENV === 'development') {
			config.plugins.delete('preload')
		}
	}
};