module.exports = {
    entry: "./src/saikoro_client_standalone.ts",
    output: {
        filename: "./docs/saikoro_client.js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".ts"],
    },
    module : {
        loaders: [
            {
                test   : /\.ts$/,
                loader : "ts-loader",
                options: {
                    configFileName: "tsconfig-es6.json"
                }
            }
        ]
    },
};
