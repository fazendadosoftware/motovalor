import Realm from 'realm';
import ModelYear from './ModelYear';
import Make from './Make';
export declare type VehicleTypeCode = 1 | 2 | 3;
export declare type FuelTypeCode = 'A' | 'D' | 'G';
export default class Model {
    id: number;
    make?: Make;
    vehicleTypeCode?: VehicleTypeCode;
    name?: string;
    fipeCode?: string;
    fuelTypeCode?: FuelTypeCode;
    modelYears?: Realm.Results<ModelYear>;
    constructor(id?: number);
    static translateFuelType: (input: any) => FuelTypeCode;
    static schema: Realm.ObjectSchema;
    static getModelFieldIndexes(columns: string[]): {
        makeColumnIndex: number;
        modelKeys: (string | number)[][];
        priceColIndex: number;
        modelYearColumnIndex: number;
    };
    static getModelIdString: (model: Model & {
        makeId: string;
    }) => string;
    static fromRow(row: any, modelKeys: (string | number)[][], makeId: number): Model;
}
