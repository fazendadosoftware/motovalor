/* eslint-env node, jest */
import Realm from 'realm'
import AdmZip from 'adm-zip'
import { join } from 'path'
import { readFileSync } from 'fs'
import { openRealm, updateDatabaseFromData, RepositoryData } from '../../data/lib/realm'

const DATAPATH = join(__dirname, '..', '..', 'data', 'store')
const JSON_FILENAME = 'fipe_indexes.json'
const ZIP_FILENAME = 'fipe_indexes.zip'
const REALM_FILENAME = 'fipe.realm'

let r: Realm
let data: RepositoryData

describe('realm.ts', () => {
  beforeAll(async () => {
    const zip = new AdmZip(join(DATAPATH, ZIP_FILENAME))
    const jsonEntry = zip.getEntry(JSON_FILENAME)
    if (jsonEntry === null) throw Error('could not find json entry in zip file')
    data = JSON.parse(zip.readAsText(jsonEntry))
    r = await openRealm(join(DATAPATH, REALM_FILENAME))
  })

  afterAll(() => r.close())

  test('it updates database from indexes file', async () => {
    await updateDatabaseFromData(r, data)
    const compactionResult = r.compact()
    expect(compactionResult).toEqual(true)
    r.close()
    const dbFile = readFileSync(join(DATAPATH, REALM_FILENAME))
    const zip = new AdmZip()
    zip.addFile(REALM_FILENAME, dbFile, 'utf-8')
    zip.writeZip(join(DATAPATH, REALM_FILENAME + '.zip'))
  }, 600000)
})
