import { v3 } from 'murmurhash';
import ModelYear from './ModelYear';
const MODEL_ID_SEED = 982034890;
const modelKeyIndex = {
    makeId: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
export default class Model {
    constructor() {
        this.id = -1;
        this.makeId = -1;
        this.vehicleTypeCode = 1;
        this.name = '';
        this.fipeCode = '';
        this.fuelTypeCode = 'G';
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
        model.id = v3(Model.getModelIdString(model), MODEL_ID_SEED);
        model.makeId = makeId;
        if (model.fuelTypeCode !== undefined) {
            // @ts-ignore
            const ftCode = Model.FUEL_TYPE_DICTIONARY[model.fuelTypeCode];
            if (ftCode === undefined)
                throw Error(`Invalid fuel type code ${model.fuelTypeCode}`);
            model.fuelTypeCode = ftCode;
        }
        return model;
    }
    static getKeys() {
        return Object.keys(new Model());
    }
}
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
            objectType: ModelYear.schema.name,
            property: 'model'
        }
    }
};
Model.getModelIdString = (model) => `${model.makeId} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_');
//# sourceMappingURL=Model.js.map