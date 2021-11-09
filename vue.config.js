const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pages: {
    index: {
      entry: "example/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  css: {
    extract: true, // 是否单独抽离css
  },

  configureWebpack: {
    output: {
      libraryExport: "default",
    },
    module: {
      rules: [
        {
          test: "/.scss$/",
          use: ["vue-style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    resolve: {
      alias: { "/@components/": resolve("example/components") },
    },
  },
};
