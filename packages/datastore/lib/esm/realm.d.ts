import Realm from 'realm';
import Fuse from 'fuse.js';
import { FipeTable, Make, Model, ModelYear } from './model';
export interface RepositoryData {
    fipeTables: FipeTable[];
    makes: Make[];
    models: Model[];
    modelYears: ModelYear[];
}
export declare const openRealm: (path?: string) => Promise<Realm>;
export declare const updateDatabaseFromData: (realm: Realm, data: RepositoryData) => Promise<void>;
export declare const buildFTSIndexFromDatabase: (realm: Realm) => Promise<{
    keys: readonly string[];
    collection: Fuse.FuseIndexRecords;
}>;
//# sourceMappingURL=realm.d.ts.map