import Realm, { ObjectSchema } from 'realm';
import { ObjectId } from 'bson';
export declare type TableId = number;
export declare class FipeTable {
    id?: number;
    date?: number;
    constructor(id?: number, date?: number);
    static schema: ObjectSchema;
}
export interface ModelYearDeltas {
    delta1M?: number;
    delta3M?: number;
    delta6M?: number;
    delta12M?: number;
    delta24M?: number;
    delta36M?: number;
}
export declare class ModelYear {
    id: ObjectId;
    model: Model;
    year: number;
    prices: Record<number, number> | number[];
    price?: number;
    delta1M?: number;
    delta3M?: number;
    delta6M?: number;
    delta12M?: number;
    delta24M?: number;
    delta36M?: number;
    static schema: Realm.ObjectSchema;
    static getDeltaMonthIndexesSet: (windowYearSize: number) => Set<number>;
    static getDeltaFields(deltaPrices: number[]): ModelYearDeltas;
    constructor(modelId: number, year: number, prices?: Record<number, number>);
    putPrice(dateIndex: number | string, value: number): void;
    static getModelYearPKey: (modelYear: ModelYear) => string;
    static getKeys(): string[];
    static getJsonKeys(): string[];
}
export declare type VehicleTypeCode = 1 | 2 | 3;
export declare type FuelTypeCode = 'A' | 'D' | 'G';
export declare class Model {
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
export declare class Make {
    id: number;
    name?: string;
    models?: Realm.Results<Model>;
    constructor(id?: number);
    static schema: Realm.ObjectSchema;
    static create(name: string): Make;
}
