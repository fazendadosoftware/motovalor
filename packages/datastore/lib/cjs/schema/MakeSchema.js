"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const murmurhash_1 = __importDefault(require("murmurhash"));
const ModelSchema_1 = __importDefault(require("./ModelSchema"));
class MakeSchema {
    constructor(name) {
        this.name = name.toUpperCase();
        this.id = murmurhash_1.default.v3(name);
    }
}
exports.default = MakeSchema;
MakeSchema.schema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        models: {
            type: 'linkingObjects',
            objectType: ModelSchema_1.default.schema.name,
            property: 'make'
        }
    }
};
//# sourceMappingURL=MakeSchema.js.map