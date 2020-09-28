const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
    context: path.join(__dirname, "src"),
    entry: [
        "./index.tsx",
    ],
    target: 'node',
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.tsx)$/,
                loaders: ["ts-loader"],
                include: [path.join(__dirname, "src"), path.join(__dirname, "data")],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(sass|scss)$/,
                loader: "raw-loader"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|jpg|png)$/,
                loader: "file-loader?name=[name].[ext]"
            }
        ]
    }
};