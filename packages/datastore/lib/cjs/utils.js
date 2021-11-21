"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnakeCase = void 0;
var camelToSnakeCase = function (str) { return str.replace(/[A-Z]/g, function (letter) { return "_".concat(letter.toLowerCase()); }); };
exports.camelToSnakeCase = camelToSnakeCase;
//# sourceMappingURL=utils.js.map