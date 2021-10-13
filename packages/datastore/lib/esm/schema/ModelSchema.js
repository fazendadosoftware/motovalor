import MakeSchema from './MakeSchema';
import ModelYearSchema from './ModelYearSchema';
import murmurhash from 'murmurhash';
const modelKeyIndex = {
    make: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
export default class ModelSchema {
    constructor() {
        this.id = -1;
    }
    static getModelFieldIndexes(columns) {
        const modelKeys = Object.entries(modelKeyIndex)
            .map(([key, label]) => ([key, columns.indexOf(label)]));
        const priceColIndex = columns.indexOf('Valor');
        const modelYearIndex = columns.indexOf('AnoModelo');
        return { modelKeys, priceColIndex, modelYearIndex };
    }
    static fromRow(row, modelKeys) {
        const model = modelKeys.reduce((accumulator, [key, idx]) => ({ ...accumulator, [key]: row[idx] }), {});
        // @ts-ignore
        model.make = new MakeSchema(model.make);
        if (model.name !== undefined)
            model.name = model.name.toUpperCase();
        model.id = murmurhash.v3(ModelSchema.getModelIdString(model));
        if (model.fuelTypeCode !== undefined) {
            // @ts-ignore
            const ftCode = ModelSchema.FUEL_TYPE_DICTIONARY[model.fuelTypeCode];
            if (ftCode === undefined)
                throw Error(`Invalid fuel type code ${model.fuelTypeCode}`);
            model.fuelTypeCode = ftCode;
        }
        return model;
    }
}
ModelSchema.FUEL_TYPE_DICTIONARY = {
    G: 'G',
    D: 'D',
    Á: 'A'
};
ModelSchema.schema = {
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
            objectType: ModelYearSchema.schema.name,
            property: 'model'
        }
    }
};
ModelSchema.getModelIdString = (model) => `${model?.make?.name} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_');
//# sourceMappingURL=ModelSchema.js.map