import { FipeTable, Make, Model, ModelYear } from './model';
export declare const getIndexOfExistingReferenceTablesInRepository: () => Promise<Record<number, number>>;
export declare const getExistingTableIdsInRepository: () => Promise<number[]>;
export declare type MakeId = number;
export declare type ModelId = number;
export declare type RefDate = string;
export declare type Price = number;
export interface OutputData {
    tableId: number;
    refDate: number;
    makeIndex: Record<MakeId, Make>;
    modelIndex: Record<ModelId, Model>;
    modelYearIndex: Record<string, ModelYear>;
}
export interface RepositoryData {
    fipeTables: FipeTable[];
    makes: Make[];
    models: Model[];
    modelYears: ModelYear[];
}
export declare const buildIndexesFromRepository: () => Promise<RepositoryData>;
