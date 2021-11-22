import { v3 } from 'murmurhash';
import ModelYear from './ModelYear';
import Make from './Make';
const MODEL_ID_SEED = 982034890;
const modelKeyIndex = {
    makeId: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
export default class Model {
    constructor(id) {
        this.id = -1;
        this.make = new Make();
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
        model.id = v3(Model.getModelIdString(model), MODEL_ID_SEED);
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
            objectType: ModelYear.schema.name,
            property: 'model'
        }
    }
};
Model.getModelIdString = (model) => `${model.make.id} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_');
//# sourceMappingURL=Model.js.map