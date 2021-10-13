import { Filesystem, Directory } from '@capacitor/filesystem'
import axios from 'axios'
import AdmZip from 'adm-zip'
import { join } from 'path'

const DB_FOLDER_NAME = 'motovalor'
const DB_FILE_NAME = 'fipe.realm'

const localFolderExists = async (name: string): Promise<string | false> => {
  const stat = await Filesystem.stat({ path: name, directory: Directory.Data })
    .catch(() => null)
  return stat?.uri ?? false
}

const getLocalDbFileUri = async (filename: string, folder: string): Promise<string> => {
  let uri: string | null = null

  if (!await localFolderExists(folder)) await Filesystem.mkdir({ path: folder, directory: Directory.Data });
  ({ uri } = await Filesystem.stat({ path: join(folder, filename), directory: Directory.Data })
    .catch(() => { return { uri: null } }))

  if (uri === null) {
    const dbEntry = await axios.get('/databases/fipe.realm.zip', { responseType: 'arraybuffer' })
      .then(({ data }: { data: any }) => new AdmZip(Buffer.from(data)))
      .then((zip: AdmZip) => zip.getEntry(DB_FILE_NAME))
    if (dbEntry === null) throw Error(`could not find ${DB_FILE_NAME} in zip file`)
    const data = dbEntry.getData().toString('base64');
    ({ uri } = await Filesystem.writeFile({ path: join(DB_FOLDER_NAME, DB_FILE_NAME), directory: Directory.Data, data }))
  }
  return uri ?? ''
}

const getLocalDatabase = async () => {
  const localDbFileUri = await getLocalDbFileUri(DB_FILE_NAME, DB_FOLDER_NAME)
  console.log('LOCAL DB FILE AT', localDbFileUri, Realm)
  // const realm = await Realm.open({ path: localDbFileUri, readOnly: true })
  // console.log('REALM', realm)
  // realm.close()
}

const getInstance = async () => {
  await getLocalDatabase()
}

const useRealm = () => ({
  getInstance
})

export default useRealm
