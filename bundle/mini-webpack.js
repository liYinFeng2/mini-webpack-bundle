const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

module.exports = class Webpack{
  constructor (options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
  }
  run () {
    const modulesArr = []
    const modulesObj = {}
    const AST = this.parse(this.entry)
    const CODE = this.transform(AST, this.entry)

    modulesArr.push(CODE)
    for (let i=0; i< modulesArr.length; i++ ) {
      const { dependencies } = modulesArr[i]
      if (dependencies) {
        for (var key in dependencies) {
          modulesArr.push(this.transform(this.parse(dependencies[key]), dependencies[key]))
        }
      }
    }
    modulesArr.forEach((item) => {
      modulesObj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    this.generate(modulesObj)
  }
  
  /**
   * parse：编译方法
   * 作用：将源代码生成对应的AST(抽象语法树)
   */
  parse (entryFile) {
    const content = fs.readFileSync(entryFile, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module'
    })
    return ast
  }

  /**
   * transform：转换方法
   * 作用：将AST(抽象语法树)进行相关的语法转换，代码压缩等操作
   */
  transform (ast, entryFile) {
    // 1. 遍历AST对应的依赖，进行递归查找
    const dependencies = {}

    traverse(ast, {
      ImportDeclaration({ node }) {
        dependencies[node.source.value] = './'+path.join(path.dirname(entryFile), node.source.value)
      }
    })
    
    // 2. 使用对应的扩展babel进行响应的扩展
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })

    return {
      entryFile,
      dependencies,
      code
    }
  }

  /**
   * generate：生成方法
   * 作用：将转换过的AST(抽象语法树)拼接成字符串形式的JavaScript
   */
  generate (modulesObj) {
    let outputPath = path.join(this.output.path, this.output.filename)
    let modulesStr = JSON.stringify(modulesObj)
    const bundle = `(function(modules){
      function require(params) {
        function localRequire(name) {
          return require(modules[params].dependencies[name])
        }
        const exports = {};
        (function(require, exports, code){
          eval(code)
        })(localRequire, exports, modules[params].code)

        return exports;
      }
      require('${this.entry}')
    })(${modulesStr})`
    fs.writeFileSync(outputPath, bundle, 'utf-8')
  }
}