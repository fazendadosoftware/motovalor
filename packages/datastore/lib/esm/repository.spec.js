import test from 'ava';
import { buildIndexesFromRepository } from './repository';
import { writeFileSync } from 'fs';
test('it builds output data from repository', async (t) => {
    const data = await buildIndexesFromRepository();
    t.assert(Array.isArray(data.fipeTables) && data.fipeTables.length > 0);
    t.assert(Array.isArray(data.makes) && data.makes.length > 0);
    t.assert(Array.isArray(data.models) && data.models.length > 0);
    t.assert(Array.isArray(data.modelYears) && data.modelYears.length > 0);
    writeFileSync('fipe-indexes.json', JSON.stringify(data, null, 2));
    t.pass();
});
//# sourceMappingURL=repository.spec.js.map