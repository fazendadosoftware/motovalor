"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ava_1 = (0, tslib_1.__importDefault)(require("ava"));
var repository_1 = require("./repository");
var fs_1 = require("fs");
(0, ava_1.default)('it builds output data from repository', function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var data;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, repository_1.buildIndexesFromRepository)()];
            case 1:
                data = _a.sent();
                t.assert(Array.isArray(data.fipeTables) && data.fipeTables.length > 0);
                t.assert(Array.isArray(data.makes) && data.makes.length > 0);
                t.assert(Array.isArray(data.models) && data.models.length > 0);
                t.assert(Array.isArray(data.modelYears) && data.modelYears.length > 0);
                (0, fs_1.writeFileSync)('fipe-indexes.json', JSON.stringify(data, null, 2));
                t.pass();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=repository.spec.js.map