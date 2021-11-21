import { ObjectSchema } from 'realm';
import Make from './Make';
export declare type VehicleTypeCode = 1 | 2 | 3;
export declare type FuelTypeCode = 'A' | 'D' | 'G';
export default class Model {
    id: number;
    makeId?: number;
    make?: Make;
    vehicleTypeCode?: VehicleTypeCode;
    name?: string;
    fipeCode?: string;
    fuelTypeCode?: FuelTypeCode;
    static FUEL_TYPE_DICTIONARY: {
        G: string;
        D: string;
        Á: string;
    };
    static schema: ObjectSchema;
    static getModelFieldIndexes(columns: string[]): {
        makeColumnIndex: number;
        modelKeys: (string | number)[][];
        priceColIndex: number;
        modelYearColumnIndex: number;
    };
    static getModelIdString: (model: Model) => string;
    static fromRow(row: any, modelKeys: (string | number)[][], makeId: number): Model;
    static getKeys(): string[];
}
