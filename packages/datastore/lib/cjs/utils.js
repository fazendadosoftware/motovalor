"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnakeCase = void 0;
const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
exports.camelToSnakeCase = camelToSnakeCase;
//# sourceMappingURL=utils.js.map