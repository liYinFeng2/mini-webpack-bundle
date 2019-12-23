(function(modules){
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
      require('./src/index.js')
    })({"./src/index.js":{"dependencies":{"./math.js":"./src/math.js","./test.js":"./src/test.js"},"code":"\"use strict\";\n\nvar _math = require(\"./math.js\");\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log('test', _test[\"default\"].name);\nconsole.log('index.js');\nconsole.log('add', (0, _math.add)(10, 9));\nconsole.log('exchange', (0, _math.exchange)(100, 300));"},"./src/math.js":{"dependencies":{"./test.js":"./src/test.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.add = add;\nexports.exchange = exchange;\n\nvar _test = _interopRequireDefault(require(\"./test.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log('test', _test[\"default\"].name);\n\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction exchange(a, b) {\n  b = b - a;\n  a = a + b;\n  b = a - b;\n  return [a, b];\n}"},"./src/test.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = {\n  name: 'liyinfeng'\n};\nexports[\"default\"] = _default;"}})