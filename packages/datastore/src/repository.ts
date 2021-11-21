import { Repository, Clone, Cred, TreeEntry } from 'nodegit'
import AdmZip from 'adm-zip'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { sep, posix, join } from 'path'
import { cpus } from 'os'
import { parse } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { parallelLimit } from 'async'
import { FipeTable, Make, Model, ModelYear } from './model'

let repository: Repository

const publicKey = readFileSync(join(__dirname, '..', 'ssh_keys', 'id_rsa.pub')).toString()
const privateKey = readFileSync(join(__dirname, '..', 'ssh_keys', 'id_rsa')).toString()
const pathToRepo = join(__dirname, '../.repository')
const cloneUrl = 'git@github.com:fazendadosoftware/vehicle-prices-datasets.git'
const baseFolder = 'fipe'

const getRepositoryAuthCallbacks = () => ({
  certificateCheck: () => { return 0 },
  credentials: (url: string, userName: string) => Cred.sshKeyMemoryNew(userName, publicKey, privateKey, '')
})

const initializeRepository = async (): Promise<Repository> => {
  if (repository !== undefined) return repository
  const cloneOptions = { fetchOpts: { callbacks: getRepositoryAuthCallbacks() } }
  if (!existsSync(pathToRepo)) mkdirSync(pathToRepo)
  try {
    repository = await Repository.open(pathToRepo)
  } catch (err: any) {
    const errno: number | undefined = err?.errno
    if (errno !== -3) throw err
  }
  if (repository === undefined) {
    console.log('cloning repository...')
    repository = await Clone.clone(cloneUrl, pathToRepo, cloneOptions)
    console.log('done!')
  } else {
    console.log('fetching repository...')
    await repository.fetch('origin', { callbacks: getRepositoryAuthCallbacks() })
    console.log('done!')
  }

  try {
    await repository.getMasterCommit()
  } catch (err: any) {
    const errno: number | undefined = err?.errno
    // if no master branch exists
    if (errno === -3) {
      const filename = '.gitignore'
      const fileContent = '#ignore all kind of files\n*\n#except zip files\n!*.zip'
      writeFileSync(join(repository.workdir(), filename), fileContent)
      const index = await repository.refreshIndex()
      await index.addByPath(filename)
      await index.write()
      const oid = await index.writeTree()
      const defaultSignature = await repository.defaultSignature()
      const firstCommit = await repository.createCommit(
        'HEAD',
        defaultSignature,
        defaultSignature,
        'first commit',
        oid,
        []
      )
      await repository.createBranch('master', firstCommit)
    }
  }
  return repository
}

const getReferenceTableDataset = async (referenceTableCode: number): Promise<any> => {
  if (repository === undefined) await initializeRepository()

  const HEAD = await repository.getMasterCommit()
  const tree = await HEAD.getTree()
  const filename = `${referenceTableCode}.zip`

  // entryPath should have the Posix format
  const entryPath = join(tree.path(), baseFolder, filename).split(sep).join(posix.sep)
  const entry = await tree.getEntry(entryPath)

  const buffer = await entry.getBlob().then(blob => blob.content())
  const zip = new AdmZip(buffer)
  const entries = zip.getEntries()
  const zipEntry = entries.find(({ entryName }) => entryName === `${referenceTableCode}.json`)
  if (typeof zipEntry === 'undefined') {
    const errorMsg = `${referenceTableCode}.json not found in ${referenceTableCode}.zip`
    console.error(errorMsg)
    throw Error(errorMsg)
  }
  return JSON.parse(zipEntry.getData().toString())
}

export const getIndexOfExistingReferenceTablesInRepository = async () => {
  if (repository === undefined) await initializeRepository()
  const HEAD = await repository.getMasterCommit()
  // PULL LATEST COMMITS FROM MASTER BRANCH
  await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
    .then(() => repository.mergeBranches('master', 'origin/master'))
  const folder = await HEAD.getEntry(baseFolder)
  if (folder.isDirectory()) {
    const entries = await folder.getTree().then(tree => tree.entries())
    const fileIndex = entries
      .filter(entry => entry.isFile())
      .reduce((accumulator: any, entry) => {
        const groups = entry.name().match(/^(\d+).zip/)
        if (Array.isArray(groups) && groups.length === 2) accumulator[groups[1]] = true
        return accumulator
      }, {})
    const index: Record<number, number> = {}
    const logProgress = () => {
      const percComplete = Math.round(Object.keys(index).length * 100 / Object.keys(fileIndex).length)
      console.log(`${percComplete}% scanning existing tables in repository`)
    }
    const interval = setInterval(() => logProgress(), 2000)
    for (const refTableId in fileIndex) {
      const { rows, referenceTable }: { rows: any[], referenceTable: number } = await getReferenceTableDataset(parseInt(refTableId))
      index[referenceTable] = rows.length
    }
    clearInterval(interval)
    logProgress()
    return index
  } else {
    const errMsg = `folder ${baseFolder}/ not found`
    console.error(errMsg)
    throw Error(errMsg)
  }
}

export const getExistingTableIdsInRepository = async () => {
  if (repository === undefined) await initializeRepository()
  const HEAD = await repository.getMasterCommit()
  // PULL LATEST COMMITS FROM MASTER BRANCH
  await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
    .then(() => repository.mergeBranches('master', 'origin/master'))
  const folder = await HEAD.getEntry(baseFolder)
  if (folder.isDirectory()) {
    const entries = await folder.getTree().then(tree => tree.entries())
    const tableIds = entries
      .filter(entry => entry.isFile())
      .reduce((accumulator, entry) => {
        const groups = entry.name().match(/^(\d+).zip/)
        if (Array.isArray(groups) && groups.length === 2) {
          const tableId = parseInt(groups[1])
          accumulator.add(tableId)
        }
        return accumulator
      }, new Set<number>())
    return Array.from(tableIds).sort((a: number, b: number) => a - b)
  } else {
    const errMsg = `folder ${baseFolder}/ not found`
    console.error(errMsg)
    throw Error(errMsg)
  }
}

export type MakeId = number
export type ModelId = number
export type RefDate = string
export type Price = number

export interface OutputData {
  tableId: number
  refDate: number
  makeIndex: Record<MakeId, Make>
  modelIndex: Record<ModelId, Model>
  modelYearIndex: Record<string, ModelYear>
}

const processTableData = async (tableData: any): Promise<OutputData> => {
  const { referenceTable, columns, rows } = tableData

  const { makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex } = Model.getModelFieldIndexes(columns)

  const refDate = parseInt(parse(rows[0][columns.indexOf('MesReferencia')].trim(), 'MMMM \'de\' yyyy', new Date(), { locale: ptBR })
    .toISOString()
    .split('T')[0].replace(/-/g, '').slice(0, -2))
  const makeIndex: Record<number, Make> = {}
  const modelIndex: Record<string, Model> = {}
  const modelYearIndex: Record<string, ModelYear> = {}

  rows.forEach((row: any) => {
    const make = Make.create(row[makeColumnIndex])
    makeIndex[make.id] = make
    const model = Model.fromRow(row, modelKeys, make.id)

    if (modelIndex[model.id] === undefined) modelIndex[model.id] = model
    // check for collisions...
    else {
      const idStringCurrent = Model.getModelIdString(modelIndex[model.id])
      const idStringNew = Model.getModelIdString(model)
      if (idStringCurrent !== idStringNew) throw Error(`ID collision: ${idStringNew} !== ${idStringCurrent}`)
    }

    const value = Number(row[priceColIndex].replace(/[R$.\s]/g, '').replace(/,/g, '.'))
    const year = Number(row[modelYearColumnIndex])
    // const dateIndex = parseInt(refDate.slice(0, -2).replace(/-/g, ''))
    const modelYear = new ModelYear(model.id, year)
    const modelYearId = ModelYear.getModelYearPKey(modelYear)
    if (modelYearIndex[modelYearId] === undefined) modelYearIndex[modelYearId] = modelYear
    modelYearIndex[modelYearId].putPrice(refDate, value)
  })
  return { tableId: referenceTable, refDate, makeIndex, modelIndex, modelYearIndex }
}

export interface RepositoryData {
  fipeTables: FipeTable[]
  makes: Make[]
  models: Model[]
  modelYears: ModelYear[]
}

export const buildIndexesFromRepository = async (): Promise<RepositoryData> => {
  if (repository === undefined) await initializeRepository()
  const HEAD = await repository.getMasterCommit()
  // PULL LATEST COMMITS FROM MASTER BRANCH
  await repository.fetchAll({ callbacks: getRepositoryAuthCallbacks() })
    .then(() => repository.mergeBranches('master', 'origin/master'))
  const folder = await HEAD.getEntry(baseFolder)
  if (folder.isDirectory()) {
    const entries = await folder.getTree().then(tree => tree.entries())
    const files: number[] = entries
      .filter(entry => entry.isFile())
      .reduce((accumulator: number[], entry: TreeEntry) => {
        const groups = entry.name().match(/^(\d+).zip/)
        if (Array.isArray(groups) && groups.length === 2) accumulator.push(parseInt(groups[1]))
        return accumulator
      }, [])
    let processedFiles: number = 0
    const logProgress = () => {
      const percComplete = Math.round(processedFiles * 100 / files.length)
      console.log(`${percComplete}% scanning existing tables in repository`)
    }
    const interval = setInterval(() => logProgress(), 2000)
    const fipeTables: FipeTable[] = []
    const makeIndex: Record<number, Make> = {}
    const modelIndex: Record<string, Model> = {}
    const modelYearIndex: Record<string, ModelYear> = {}

    const processes = cpus().length

    for (const refTableId of files) {
      const tableData = await getReferenceTableDataset(refTableId)
      const outputData = await processTableData(tableData)
      const { tableId, refDate, makeIndex: tableMakeIndex, modelIndex: tableModelIndex, modelYearIndex: tableModelYearIndex } = outputData
      fipeTables.push(new FipeTable(tableId, refDate))

      const makeIndexCallbacks = Object.entries(tableMakeIndex)
        .map(([makeId, make]) => callback => {
          if (makeIndex[makeId] === undefined) makeIndex[makeId] = make
          callback(null)
        })
      parallelLimit(makeIndexCallbacks, processes)

      const modelIndexCallbacks = Object.entries(tableModelIndex)
        .map(([modelId, model]) => callback => {
          if (modelIndex[modelId] === undefined) modelIndex[modelId] = model
          callback(null)
        })
      parallelLimit(modelIndexCallbacks, processes)

      const modelYearCallbacks = Object.entries(tableModelYearIndex)
        .map(([modelYearId, modelYear]) => callback => {
          if (modelYearIndex[modelYearId] === undefined) modelYearIndex[modelYearId] = modelYear
          else {
            Object.entries(modelYear.prices)
              .forEach(([dateIndex, price]) => modelYearIndex[modelYearId].putPrice(dateIndex, price))
          }
          callback(null)
        })
      parallelLimit(modelYearCallbacks, processes)

      processedFiles++
    }
    clearInterval(interval)
    logProgress()

    const makes = Object.values(makeIndex)
    const models = Object.values(modelIndex)
    const modelYears = Object.values(modelYearIndex)

    return { fipeTables, makes, models, modelYears }
  } else {
    const errMsg = `folder ${baseFolder}/ not found`
    console.error(errMsg)
    throw Error(errMsg)
  }
}
