import Realm from 'realm';
import MakeSchema from './MakeSchema';
import ModelYearSchema from './ModelYearSchema';
export declare type ModelYear = string;
export default class ModelSchema {
    id: number;
    make?: MakeSchema;
    vehicleTypeCode?: 1 | 2 | 3;
    name?: string;
    fipeCode?: string;
    fuelTypeCode?: 'A' | 'D' | 'G';
    modelYears?: ModelYearSchema[];
    static FUEL_TYPE_DICTIONARY: {
        G: string;
        D: string;
        Á: string;
    };
    static schema: Realm.ObjectSchema;
    static getModelFieldIndexes(columns: string[]): {
        modelKeys: (string | number)[][];
        priceColIndex: number;
        modelYearIndex: number;
    };
    static getModelIdString: (model: ModelSchema) => string;
    static fromRow(row: any, modelKeys: (string | number)[][]): ModelSchema;
}
