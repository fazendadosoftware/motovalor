"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var murmurhash_1 = require("murmurhash");
var ModelYear_1 = (0, tslib_1.__importDefault)(require("./ModelYear"));
var MODEL_ID_SEED = 982034890;
var modelKeyIndex = {
    makeId: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
var Model = /** @class */ (function () {
    function Model() {
        this.id = -1;
        this.makeId = -1;
        this.vehicleTypeCode = 1;
        this.name = '';
        this.fipeCode = '';
        this.fuelTypeCode = 'G';
    }
    Model.getModelFieldIndexes = function (columns) {
        var modelKeys = Object.entries(modelKeyIndex)
            .map(function (_a) {
            var key = _a[0], label = _a[1];
            return ([key, columns.indexOf(label)]);
        });
        var priceColIndex = columns.indexOf('Valor');
        var modelYearColumnIndex = columns.indexOf('AnoModelo');
        var makeColumnIndex = columns.indexOf('Marca');
        return { makeColumnIndex: makeColumnIndex, modelKeys: modelKeys, priceColIndex: priceColIndex, modelYearColumnIndex: modelYearColumnIndex };
    };
    Model.fromRow = function (row, modelKeys, makeId) {
        var model = modelKeys.reduce(function (accumulator, _a) {
            var _b;
            var key = _a[0], idx = _a[1];
            return ((0, tslib_1.__assign)((0, tslib_1.__assign)({}, accumulator), (_b = {}, _b[key] = row[idx], _b)));
        }, {});
        if (model.name !== undefined)
            model.name = model.name.toUpperCase();
        model.id = (0, murmurhash_1.v3)(Model.getModelIdString(model), MODEL_ID_SEED);
        model.makeId = makeId;
        if (model.fuelTypeCode !== undefined) {
            // @ts-ignore
            var ftCode = Model.FUEL_TYPE_DICTIONARY[model.fuelTypeCode];
            if (ftCode === undefined)
                throw Error("Invalid fuel type code ".concat(model.fuelTypeCode));
            model.fuelTypeCode = ftCode;
        }
        return model;
    };
    Model.getKeys = function () {
        return Object.keys(new Model());
    };
    Model.FUEL_TYPE_DICTIONARY = {
        G: 'G',
        D: 'D',
        Á: 'A'
    };
    Model.schema = {
        name: 'Model',
        primaryKey: 'id',
        properties: {
            id: 'int',
            make: 'Make',
            vehicleTypeCode: 'int',
            name: 'string',
            fipeCode: 'string',
            fuelTypeCode: 'string',
            modelYears: {
                type: 'linkingObjects',
                objectType: ModelYear_1.default.schema.name,
                property: 'model'
            }
        }
    };
    Model.getModelIdString = function (model) { return "".concat(model.makeId, " ").concat(model.name, " ").concat(model.fuelTypeCode).replace(/ /g, '_'); };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=Model.js.map