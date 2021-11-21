"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ava_1 = (0, tslib_1.__importDefault)(require("ava"));
var path_1 = require("path");
var index_1 = require("./index");
(0, ava_1.default)('it creates a db file from repository', function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var DB_PATH, DB_FILENAME, path;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0:
                DB_PATH = '.db';
                DB_FILENAME = 'fipe.realm';
                return [4 /*yield*/, (0, index_1.createDatabaseFromRepository)(DB_PATH, DB_FILENAME)];
            case 1:
                path = _a.sent();
                t.assert((0, path_1.join)(DB_PATH, DB_FILENAME + '.zip') === path);
                t.pass();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.spec.js.map