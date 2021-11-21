"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFTSIndexFromDatabase = exports.updateDatabaseFromData = exports.openRealm = void 0;
var tslib_1 = require("tslib");
var realm_1 = (0, tslib_1.__importStar)(require("realm"));
var fuse_js_1 = (0, tslib_1.__importDefault)(require("fuse.js"));
var model_1 = require("./model");
var openRealm = function (path) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var realm;
    return (0, tslib_1.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, realm_1.open)({ path: path, schema: [model_1.Make, model_1.Model, model_1.ModelYear] })];
            case 1:
                realm = _a.sent();
                return [2 /*return*/, realm];
        }
    });
}); };
exports.openRealm = openRealm;
var windowYearSize = 3;
var deltaPriceIndexes = model_1.ModelYear.getDeltaMonthIndexesSet(5);
var updateDatabaseFromData = function (realm, data) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var fipeTables, makes, models, modelYears, tableDates, getPreviousPrice_1;
    return (0, tslib_1.__generator)(this, function (_a) {
        fipeTables = data.fipeTables, makes = data.makes, models = data.models, modelYears = data.modelYears;
        tableDates = fipeTables.map(function (_a) {
            var date = _a.date;
            return date;
        })
            .sort()
            .reverse()
            .slice(0, windowYearSize * 12 + 1);
        realm.beginTransaction();
        try {
            makes
                .forEach(function (make) { return realm.create(model_1.Make.schema.name, make, realm_1.default.UpdateMode.All); });
            models
                .forEach(function (model) {
                model.make = { id: model.makeId };
                realm.create(model_1.Model.schema.name, model, realm_1.default.UpdateMode.All);
            });
            getPreviousPrice_1 = function (i, tableDates, modelYearPrices) {
                var _a;
                if (modelYearPrices[tableDates[i]] === undefined && (i + 1) < tableDates.length)
                    return getPreviousPrice_1(i + 1, tableDates, modelYearPrices);
                else
                    return (_a = modelYearPrices[tableDates[i]]) !== null && _a !== void 0 ? _a : null;
            };
            modelYears
                .filter(function (modelYear) { return !isNaN(modelYear.prices[tableDates[0]]); }) // filter modelYears with price listing for the latest table...
                .forEach(function (modelYear) {
                var _a = tableDates
                    .reduce(function (accumulator, date, i) {
                    var _a;
                    var price = (_a = modelYear.prices[date]) !== null && _a !== void 0 ? _a : getPreviousPrice_1(i, tableDates, modelYear.prices);
                    if (price === null)
                        return accumulator;
                    accumulator.prices.push(price);
                    if (deltaPriceIndexes.has(i)) {
                        var delta = (accumulator.prices[0] / price) - 1;
                        accumulator.deltas.push(delta);
                        accumulator.deltaPrices.push(accumulator.prices[0] - price);
                    }
                    return accumulator;
                }, { prices: [], deltaPrices: [], deltas: [] }), prices = _a.prices, deltas = _a.deltas;
                modelYear.model = { id: modelYear.modelId };
                modelYear.prices = prices;
                modelYear.price = prices[0];
                var deltaFields = model_1.ModelYear.getDeltaFields(deltas);
                Object.entries(deltaFields).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    modelYear[key] = value;
                });
                realm.create(model_1.ModelYear.schema.name, modelYear, realm_1.default.UpdateMode.All);
            });
            realm.commitTransaction();
        }
        catch (error) {
            realm.cancelTransaction();
            throw error;
        }
        return [2 /*return*/];
    });
}); };
exports.updateDatabaseFromData = updateDatabaseFromData;
var buildFTSIndexFromDatabase = function (realm) { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
    var models;
    return (0, tslib_1.__generator)(this, function (_a) {
        models = realm.objects(model_1.Model.name)
            .map(function (model) { return model.toJSON(); })
            .map(function (model) { return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, model), { modelYears: Object.keys(model.modelYears) })); });
        return [2 /*return*/, fuse_js_1.default.createIndex(['make', 'name', 'modelYears'], models).toJSON()];
    });
}); };
exports.buildFTSIndexFromDatabase = buildFTSIndexFromDatabase;
//# sourceMappingURL=realm.js.map