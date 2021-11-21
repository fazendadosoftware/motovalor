"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ava_1 = (0, tslib_1.__importDefault)(require("ava"));
var path_1 = require("path");
var fs_1 = require("fs");
var realm_1 = require("./realm");
// import { buildIndexesFromRepository } from './repository'
var model_1 = require("./model");
var data = require('../fipe-indexes.json');
// const DATAPATH = join(__dirname, '..', '.tmp', uuidv4())
var DATAPATH = (0, path_1.join)(__dirname, '..', '.realm');
var REALM_FILENAME = 'fipe.realm';
ava_1.default.before(function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var _a;
    return (0, tslib_1.__generator)(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(0, fs_1.existsSync)(DATAPATH))
                    (0, fs_1.mkdirSync)(DATAPATH, { recursive: true });
                _a = t.context;
                return [4 /*yield*/, (0, realm_1.openRealm)((0, path_1.join)(DATAPATH, REALM_FILENAME))];
            case 1:
                _a.realm = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1.default.before(function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    return (0, tslib_1.__generator)(this, function (_a) {
        t.context.data = data;
        return [2 /*return*/];
    });
}); });
ava_1.default.skip('it initializes the db with schema and empty collections', function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var fipeTableCount, modelCount, modelYearCount;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, realm_1.updateDatabaseFromData)(t.context.realm, t.context.emptyData)];
            case 1:
                _a.sent();
                fipeTableCount = t.context.realm.objects(model_1.FipeTable.schema.name).length;
                modelCount = t.context.realm.objects(model_1.Model.schema.name).length;
                modelYearCount = t.context.realm.objects(model_1.ModelYear.schema.name).length;
                t.assert(fipeTableCount === t.context.emptyData.fipeTables.length);
                t.assert(modelCount === t.context.emptyData.models.length);
                t.assert(modelYearCount === t.context.emptyData.modelYears.length);
                t.pass();
                return [2 /*return*/];
        }
    });
}); });
ava_1.default.serial('it updates database from indexes file', function (t) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var modelCount;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, realm_1.updateDatabaseFromData)(t.context.realm, t.context.data)
                // const fipeTableCount = t.context.realm.objects(FipeTable.schema.name).length
            ];
            case 1:
                _a.sent();
                modelCount = t.context.realm.objects(model_1.Model.schema.name).length;
                // const modelYearCount = t.context.realm.objects(ModelYearSchema.schema.name).length
                // t.assert(fipeTableCount === t.context.data.fipeTables.length)
                t.assert(modelCount === t.context.data.models.length);
                // t.assert(modelYearCount === t.context.data.modelYears.length)
                t.pass();
                return [2 /*return*/];
        }
    });
}); });
ava_1.default.after(function (t) {
    t.context.realm.compact();
    t.context.realm.close();
    // rmdirSync(DATAPATH, { recursive: true })
});
//# sourceMappingURL=realm.spec.js.map