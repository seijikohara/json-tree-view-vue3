// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.join(__dirname, "/"),
      },
    },
  },
  pages: {
    index: {
      entry: "/index.ts",
    },
  },
};
