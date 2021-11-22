"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const murmurhash_1 = require("murmurhash");
const Model_1 = (0, tslib_1.__importDefault)(require("./Model"));
const MAKE_SEED = 3210809412;
class Make {
    constructor(id) {
        this.id = -1;
        if (id !== undefined)
            this.id = id;
    }
    static create(name) {
        const make = new Make();
        make.name = name;
        make.id = (0, murmurhash_1.v3)(name, MAKE_SEED);
        return make;
    }
}
exports.default = Make;
Make.schema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        models: {
            type: 'linkingObjects',
            objectType: Model_1.default.schema.name,
            property: 'make'
        }
    }
};
//# sourceMappingURL=Make.js.map