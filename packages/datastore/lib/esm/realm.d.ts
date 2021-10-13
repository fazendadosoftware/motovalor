import Realm from 'realm';
import Fuse from 'fuse.js';
import { FipeTableSchema, ModelSchema, ModelYearSchema } from './schema';
export interface RepositoryData {
    fipeTables: FipeTableSchema[];
    models: ModelSchema[];
    modelYears: ModelYearSchema[];
}
export declare const openRealm: (path?: string) => Promise<Realm>;
export declare const updateDatabaseFromData: (realm: Realm, data: RepositoryData) => Promise<void>;
export declare const buildFTSIndexFromDatabase: (realm: Realm) => Promise<{
    keys: readonly string[];
    collection: Fuse.FuseIndexRecords;
}>;
