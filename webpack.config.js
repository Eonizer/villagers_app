const path = require('path');

module.exports = {
    mode : 'development',
    entry : './src/index.js',
    output : {
        path : path.resolve(__dirname, 'dist'),
        filename : 'bundle.js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
          },
        compress: true,
        port:9000
    },
    module : {
        rules : [
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src/styles'),
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    }
};