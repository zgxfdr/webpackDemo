 //生产环境配置
 // webpack --config webpack.prod.config.js
 //开发环境配置
 // webpack --config webpack.dev.config.js 

 module.export = {
     mode: 'development',
     entry: "./index.js",
     //  entry: [ 
     //      //轮播图模块
     //      './src/banner.js',
     //      //主模块
     //      './src/index.js',
     //      //底部模块
     //      './src/foot.js'
     //  ],
     output: {
         path: path.resolve(__dirname, 'dist'),
         filename: '[name].bundle.js',
     },
     //其他配置
     rules: [{
         test: /\.scss$/,
         use: [{
             loader: 'style-loader'
         }, {
             loader: 'css-loader'
         }, {
             loader: 'sass-loader'
         }]
     }, {
         test: /\.less$/,
         use: [{
             loader: 'style-loader'
         }, {
             loader: 'css-loader'
         }, {
             loader: 'less-loader'
         }]
     }]

 }