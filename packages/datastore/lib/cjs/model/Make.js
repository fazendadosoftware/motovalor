"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var murmurhash_1 = require("murmurhash");
var Model_1 = (0, tslib_1.__importDefault)(require("./Model"));
var MAKE_SEED = 3210809412;
var Make = /** @class */ (function () {
    function Make(name) {
        if (name !== undefined) {
            this.name = name.toUpperCase();
            this.id = (0, murmurhash_1.v3)(this.name, MAKE_SEED);
        }
    }
    Make.fromRow = function (row, makeColumnIndex) {
        var makeName = row[makeColumnIndex];
        var make = new Make(makeName);
        return make;
    };
    Make.getKeys = function () {
        return Object.keys(new Make(''));
    };
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
    return Make;
}());
exports.default = Make;
//# sourceMappingURL=Make.js.map