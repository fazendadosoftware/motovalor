import Realm from 'realm';
import Model from './Model';
export interface ModelYearDeltas {
    delta1M?: number;
    delta3M?: number;
    delta6M?: number;
    delta12M?: number;
    delta24M?: number;
    delta36M?: number;
}
export default class ModelYear {
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
