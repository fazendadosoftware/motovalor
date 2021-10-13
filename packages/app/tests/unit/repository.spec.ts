/* eslint-env node, jest */
import { join } from 'path'
import AdmZip from 'adm-zip'
import { buildIndexesFromRepository } from '../../data/lib/repository'
import { TextEncoder } from 'util'
global.TextEncoder = TextEncoder

const DATAPATH = join(__dirname, '..', '..', 'data', 'store')
const JSON_FILENAME = 'fipe_indexes.json'
const ZIP_FILENAME = 'fipe_indexes.zip'

describe('repository.ts', () => {
  test('it builds indexes from repository', async () => {
    const indexes = await buildIndexesFromRepository()
    const zip = new AdmZip()
    zip.addFile(JSON_FILENAME, Buffer.from(JSON.stringify(indexes, null, 2), 'utf-8'))
    zip.writeZip(join(DATAPATH, ZIP_FILENAME))
  }, 6000000)
})
