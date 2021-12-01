import { v3 } from 'murmurhash';
import { ObjectId } from 'bson';
const MODEL_ID_SEED = 982034890;
const MAKE_SEED = 3210809412;
export class FipeTable {
    constructor(id, date) {
        this.id = -1;
        this.date = -1;
        if (id !== undefined)
            this.id = id;
        if (date !== undefined)
            this.date = date;
    }
}
FipeTable.schema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: 'int'
    }
};
export class ModelYear {
    constructor(modelId, year, prices) {
        this.id = new ObjectId();
        this.model = new Model();
        this.year = -1;
        this.prices = {};
        this.model = new Model(modelId);
        this.year = year;
        if (prices !== undefined)
            this.prices = prices;
    }
    static getDeltaFields(deltaPrices) {
        const deltaMonthIndexes = [1, 3, 6, 12, 24, 36];
        const deltaFields = deltaPrices
            .slice(0, deltaMonthIndexes.length)
            .reduce((accumulator, deltaPrice, i) => {
            //@ts-expect-error
            accumulator[`delta${deltaMonthIndexes[i]}M`] = deltaPrice;
            return accumulator;
        }, {});
        return deltaFields;
    }
    putPrice(dateIndex, value) {
        if (typeof dateIndex === 'string')
            dateIndex = parseInt(dateIndex);
        this.prices[dateIndex] = value;
    }
    static getKeys() {
        return Object.keys(new ModelYear(-1, -1, {}));
    }
    static getJsonKeys() {
        return ['prices'];
    }
}
ModelYear.schema = {
    name: 'ModelYear',
    properties: {
        id: 'objectId',
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
    },
    primaryKey: 'id'
};
// 1M, 3M, 6M, 12M, 24M, 36M, 48M
ModelYear.getDeltaMonthIndexesSet = (windowYearSize) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
    .map(year => year === 0 ? [1, 3, 6] : year * 12).flat());
ModelYear.getModelYearPKey = (modelYear) => (`${modelYear.model.id}_${modelYear.year}`);
const modelKeyIndex = {
    makeId: 'Marca',
    fipeCode: 'CodigoFipe',
    vehicleTypeCode: 'TipoVeiculo',
    fuelTypeCode: 'SiglaCombustivel',
    name: 'Modelo'
};
export class Model {
    constructor(id) {
        this.id = -1;
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
        model.make = new Make(makeId);
        if (model.fuelTypeCode !== undefined) {
            const ftCode = Model.translateFuelType(model.fuelTypeCode);
            if (ftCode === undefined)
                throw Error(`Invalid fuel type code ${model.fuelTypeCode}`);
            model.fuelTypeCode = ftCode;
        }
        delete model.makeId;
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
Model.getModelIdString = (model) => `${model.makeId} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_');
export class Make {
    constructor(id) {
        this.id = -1;
        if (id !== undefined)
            this.id = id;
    }
    static create(name) {
        const make = new Make();
        make.name = name;
        make.id = v3(name, MAKE_SEED);
        return make;
    }
}
Make.schema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        models: {
            type: 'linkingObjects',
            objectType: Model.schema.name,
            property: 'make'
        }
    }
};
const getFipeSchema = () => ([Make.schema, Model.schema, ModelYear.schema]);
export { getFipeSchema };
//# sourceMappingURL=index.js.map