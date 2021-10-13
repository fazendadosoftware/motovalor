import Realm from 'realm';
import ModelSchema from './ModelSchema';
export declare type ModelYear = string;
export default class ModelYearSchema {
    model?: ModelSchema;
    year?: number;
    prices?: Record<string, number>;
    constructor(modelId?: number, modelYear?: number, prices?: Record<string, number>);
    static schema: Realm.ObjectSchema;
}
