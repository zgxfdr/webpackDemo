
// 接收forestpack.config.js配置参数，并初始化entry、output
// 开启编译run方法。处理构建模块、收集依赖、输出文件等。
// buildModule方法。主要用于构建模块（被run方法调用）
// emitFiles方法。输出文件（同样被run方法调用） 


 
// 编译构建
// entry 确定入口
// 根据配置中的 entry 找出所有的入口文件
// make 编译模块
// 从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
// build module 完成模块编译
// 经过上面一步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
// seal 输出资源
// 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
// emit 输出完成
// 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统 

const { getAST, getDependencies, transform } = require("./parser");
const path = require("path");
const fs = require("fs");



module.exports = class Compiler {
  // 接收通过lib/index.js new Compiler(options).run()传入的参数，对应`forestpack.config.js`的配置
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  // 开启编译
  run() {
    const entryModule = this.buildModule(this.entry, true); // 确定入口
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    }); 
    this.emitFiles(); 
  }
  // 构建模块相关 被run调用
  buildModule(filename, isEntry) {
    // filename: 文件名称
    // isEntry: 是否是入口文件
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      const absolutePath = path.join(process.cwd(), "./src", filename);
      ast = getAST(absolutePath);
    }

    return {
      filename, // 文件名称
      dependencies: getDependencies(ast), // 依赖列表
      transformCode: transform(ast), // 转化后的代码
    }; 
  }
  // 输出文件 被run调用
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = "";
    this.modules.map((_module) => {
      modules += `'${_module.filename}' : function(require, module, exports) {${_module.transformCode}},`;
    });

    const bundle = `
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('${this.entry}')
        })({${modules}})
    `;

    fs.writeFileSync(outputPath, bundle, "utf-8"); 
  }
};
