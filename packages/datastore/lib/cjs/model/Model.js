"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const murmurhash_1 = require("murmurhash");
const ModelYear_1 = (0, tslib_1.__importDefault)(require("./ModelYear"));
const Make_1 = (0, tslib_1.__importDefault)(require("./Make"));
const MODEL_ID_SEED = 982034890;
const modelKeyIndex = {
    makeId: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
class Model {
    constructor(id) {
        this.id = -1;
        this.make = new Make_1.default();
        this.vehicleTypeCode = 1;
        this.name = '';
        this.fipeCode = '';
        this.fuelTypeCode = 'G';
        if (id !== undefined)
            this.id = id;
    }
    static getModelFieldIndexes(columns) {
        const modelKeys = Object.entries(modelKeyIndex)
            .map(([key, label]) => ([key, columns.indexOf(label)]));
        const priceColIndex = columns.indexOf('Valor');
        const modelYearColumnIndex = columns.indexOf('AnoModelo');
        const makeColumnIndex = columns.indexOf('Marca');
        return { makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex };
    }
    static fromRow(row, modelKeys, makeId) {
        const model = modelKeys.reduce((accumulator, [key, idx]) => ({ ...accumulator, [key]: row[idx] }), {});
        if (model.name !== undefined)
            model.name = model.name.toUpperCase();
        model.id = (0, murmurhash_1.v3)(Model.getModelIdString(model), MODEL_ID_SEED);
        model.make.id = makeId;
        if (model.fuelTypeCode !== undefined) {
            const ftCode = Model.translateFuelType(model.fuelTypeCode);
            if (ftCode === undefined)
                throw Error(`Invalid fuel type code ${model.fuelTypeCode}`);
            model.fuelTypeCode = ftCode;
        }
        return model;
    }
}
exports.default = Model;
Model.translateFuelType = (input) => {
    if (typeof input !== 'string')
        throw Error(`invalid fuel type code ${input}`);
    const normalizedInput = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (['A', 'G', 'D'].indexOf(normalizedInput) < 0)
        throw Error(`invalid fuel type code ${normalizedInput}`);
    return normalizedInput;
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
Model.getModelIdString = (model) => `${model.make.id} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_');
//# sourceMappingURL=Model.js.map