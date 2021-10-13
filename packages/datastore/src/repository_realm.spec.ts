import test from 'ava'
import { buildIndexesFromRepository } from './repository'
// import { writeFileSync } from 'fs'

test('it builds indexes from repository', async t => {
  const indexes = await buildIndexesFromRepository()
  t.assert(Array.isArray(indexes.fipeTables) && indexes.fipeTables.length > 0)
  t.assert(Array.isArray(indexes.models) && indexes.models.length > 0)
  t.assert(Array.isArray(indexes.modelYears) && indexes.modelYears.length > 0)
  // writeFileSync('fipe-indexes.json', JSON.stringify(indexes, null, 2))
  t.pass()
})
