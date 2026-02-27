const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: './main.tsx',

    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
            { test: /\.s[ac]ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'] },

            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: { filename: 'images/[hash][ext][query]' },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: { filename: 'fonts/[hash][ext][query]' },
            },
        ],
    },

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
                { from: 'public', to: '.' },
            ],
        }),
    ],

    resolve: { extensions: ['.tsx', '.ts', '.js'] },

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        clean: true,
    },

    devServer: {
        static: { directory: path.join(__dirname, 'dist') },
        port: 9090,
        historyApiFallback: true,
        client: { logging: 'none', overlay: { warnings: false, errors: true } },
    },
};