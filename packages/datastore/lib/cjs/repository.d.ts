import { ModelSchema } from './schema';
import { RepositoryData } from './realm';
export declare const getIndexOfExistingReferenceTablesInRepository: () => Promise<Record<number, number>>;
export declare const getExistingTableIdsInRepository: () => Promise<number[]>;
export declare type ModelId = number;
export declare type ModelYear = number;
export declare type RefDate = string;
export declare type Price = number;
export declare type ModelYearPriceIndex = Record<ModelId, Record<ModelYear, Record<RefDate, Price>>>;
export interface OutputData {
    tableId: number;
    date: string;
    modelIndex: Record<ModelId, ModelSchema>;
    modelYearPriceIndex: ModelYearPriceIndex;
}
export declare const buildIndexesFromRepository: () => Promise<RepositoryData>;
