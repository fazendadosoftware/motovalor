import AdmZip from 'adm-zip'
import { join } from 'path'
import { readFileSync, existsSync, mkdirSync, rmdirSync, unlinkSync } from 'fs'
import { buildIndexesFromRepository } from './repository'
import { openRealm, updateDatabaseFromData } from './realm'

export const createDatabaseFromRepository = async (dbPath: string = '.db', dbFilename: string = 'fipe.realm') => {
  if (!existsSync(dbPath)) mkdirSync(dbPath, { recursive: true })
  const indexes = await buildIndexesFromRepository()
  const realm = await openRealm(join(dbPath, dbFilename))
  await updateDatabaseFromData(realm, indexes)
  realm.compact()
  realm.close()
  const dbFile = readFileSync(join(dbPath, dbFilename))
  const zip = new AdmZip()
  zip.addFile(dbFilename, dbFile, 'utf-8')
  const zipPath = join(dbPath, dbFilename + '.zip')
  zip.writeZip(zipPath)

  // cleanup...
  const fileSuffixesForDeletion = ['', '.lock', '.tmp_compaction_space']
  fileSuffixesForDeletion.forEach(suffix => unlinkSync(join(dbPath, `${dbFilename}${suffix}`)))
  rmdirSync(join(dbPath, `${dbFilename}.management`), { recursive: true })

  return zipPath
}
