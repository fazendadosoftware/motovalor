"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ModelYear = /** @class */ (function () {
    function ModelYear(modelId, year, prices) {
        this.modelId = -1;
        this.year = -1;
        this.prices = {};
        this.modelId = modelId;
        this.year = year;
        if (prices !== undefined)
            this.prices = prices;
    }
    ModelYear.getDeltaFields = function (deltaPrices) {
        var deltaMonthIndexes = [1, 3, 6, 12, 24, 36];
        var deltaFields = deltaPrices
            .slice(0, deltaMonthIndexes.length)
            .reduce(function (accumulator, deltaPrice, i) {
            accumulator["delta".concat(deltaMonthIndexes[i], "M")] = deltaPrice;
            return accumulator;
        }, {});
        return deltaFields;
    };
    ModelYear.prototype.putPrice = function (dateIndex, value) {
        this.prices[dateIndex] = value;
    };
    ModelYear.getKeys = function () {
        return Object.keys(new ModelYear(-1, -1, {}));
    };
    ModelYear.getJsonKeys = function () {
        return ['prices'];
    };
    ModelYear.schema = {
        name: 'ModelYear',
        properties: {
            model: 'Model',
            year: { type: 'int', indexed: true },
            price: 'int',
            prices: 'int[]',
            delta1M: 'float?',
            delta3M: 'float?',
            delta6M: 'float?',
            delta12M: 'float?',
            delta24M: 'float?',
            delta36M: 'float?'
        }
    };
    // 1M, 3M, 6M, 12M, 24M, 36M, 48M
    ModelYear.getDeltaMonthIndexesSet = function (windowYearSize) { return new Set((0, tslib_1.__spreadArray)([], Array(Math.ceil(windowYearSize)).keys(), true).map(function (year) { return year === 0 ? [1, 3, 6] : year * 12; }).flat()); };
    ModelYear.getModelYearPKey = function (modelYear) { return ("".concat(modelYear.modelId, "_").concat(modelYear.year)); };
    return ModelYear;
}());
exports.default = ModelYear;
//# sourceMappingURL=ModelYear.js.map