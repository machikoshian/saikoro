module.exports = {
    entry: "./src/saikoro.ts",
    output: {
        filename: "./out/client/saikoro.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "ts-loader" }
                ]
            }
        ]
    }
};
