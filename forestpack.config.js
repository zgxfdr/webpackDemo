const path = require("path");



module.exports = {
  entry: path.join(__dirname, "./src/index1.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  module: { 
  }
};