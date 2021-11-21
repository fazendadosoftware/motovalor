import test from 'ava';
import { join } from 'path';
import { createDatabaseFromRepository } from './index';
test('it creates a db file from repository', async (t) => {
    const DB_PATH = '.db';
    const DB_FILENAME = 'fipe.realm';
    const path = await createDatabaseFromRepository(DB_PATH, DB_FILENAME);
    t.assert(join(DB_PATH, DB_FILENAME + '.zip') === path);
    t.pass();
});
//# sourceMappingURL=index.spec.js.map