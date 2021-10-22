import * as sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { RepositoryData } from './repository'
import { FipeTable, Make, Model, ModelYear } from './model'

export const openDB = async (dbPath: string): Promise<Database> => open({ filename: dbPath, driver: sqlite3.cached.Database })

export const updateDatabaseFromRepositoryData = async (db: Database, data: RepositoryData) => {
  const rawDb = db.getDatabaseInstance()
  rawDb.parallelize(() => {
    const fipeTableKeys = Object.keys(new FipeTable())
    const query = `INSERT INTO fipeTable (${fipeTableKeys.join(',')}) VALUES (${fipeTableKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.fipeTables.forEach(row => {
      const values = fipeTableKeys.map(key => row[key])
      stmt.run(...values)
    })
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const makeKeys = Make.getKeys()
    const query = `INSERT INTO make (${makeKeys.join(',')}) VALUES (${makeKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.makes.forEach(row => stmt.run(...makeKeys.map(key => row[key])))
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const modelKeys = Model.getKeys()
    const query = `INSERT INTO model (${modelKeys.join(',')}) VALUES (${modelKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.models.forEach(row => stmt.run(...modelKeys.map(key => row[key])))
    stmt.finalize()
  })

  rawDb.parallelize(() => {
    const modelYearKeys = ModelYear.getKeys()
    const query = `INSERT INTO modelYear (${modelYearKeys.join(',')}) VALUES (${modelYearKeys.map(() => '?').join(',')})`
    const stmt = rawDb.prepare(query)
    data.modelYears.forEach(row => stmt.run(...modelYearKeys.map(key => key !== 'prices' ? row[key] : JSON.stringify(row[key]))))
    stmt.finalize()
  })
}

export const getSchema = async (db: Database) => {
  const tablesStmt = 'SELECT name, sql FROM sqlite_master WHERE type = "table" AND name != "migrations" AND name NOT LIKE "sqlite_%" AND name NOT LIKE "android_%" AND name NOT LIKE "sync_table";'
  const tables = await db.all<{ sql: string }[]>(tablesStmt)
    .then(rows => rows
      .map(({ sql }) => {
        const regex = /^CREATE\s+TABLE\s+(\S*)\s*\((.*)\);?$/
        const [, name, data] = regex.exec(sql.replace(/\r\n/g, ''))
        const schema = data
          .split(',  ')
          .map(s => s.trim().replace(/  +/g, ':').split(':'))
          .reduce((accumulator: any[], [column, value]) => {
            if (column.startsWith('PRIMARY KEY')) {
              const regex = /^PRIMARY\s+KEY\s+(\S*)\s*\((.*)\);?$/
              const [,, pkeys] = regex.exec(column.replace(/\r\n/g, ''))
              const constraint = ['PK', ...pkeys.split(',').map(key => key.trim())].join('_')
              accumulator.push({ constraint, value: column })
            } else if (column.startsWith('FOREIGN KEY')) {
              const regex = /^FOREIGN\s+KEY\s+(\S*)\s*(.*);?$/
              const [, fkeys, references] = regex.exec(column.replace(/\r\n/g, ''))
              const foreignkey = fkeys.replace(/[()]/g, '')
              accumulator.push({ foreignkey, value: references })
            } else {
              accumulator.push({ column, value })
            }
            return accumulator
          }, [])
        return { name, schema }
      }))
  return tables
}

export const getTriggers = async (db:Database, tableName) => {
  console.warn('Get Triggers to be implemented...')
  return []
}

export const getIndexes = async (db: Database, tableName: string) => {
  const sql = `SELECT name,tbl_name as tableName,sql FROM sqlite_master WHERE type = "index" AND tbl_name = "${tableName}" AND sql NOTNULL;`
  const indexes = await db.all<{ name: string, tableName: string, sql: string }[]>(sql)
    .then(rows => rows
      .map(({ name, sql, tableName }) => {
        const regex = /^CREATE\s+INDEX\s+(\S*)\s*ON\s*(\S*)\s*\((.*)\);?$/
        const [,, value] = regex.exec(sql.replace(/\r\n/g, ''))
        return { name, value }
      })
    )
  return indexes
}

const getTableColumns = async (db: Database, tableName: string) => {
  const sql = `PRAGMA table_info(${tableName});`
  const columns = await db.all<{ name: string, type: string }[]>(sql)
    .then(rows => rows.map(({ name, type }) => ({ name, type })))
  return columns
}

export const getValues = async (db: Database, tableName: string) => {
  const sql = `SELECT * FROM ${tableName};`
  const columnNames = await getTableColumns(db, tableName).then(columns => columns.map(({ name }) => name))
  const values = await db.all<any[]>(sql)
  // .then(rows => rows.map(row => columnNames.map(column => row[column]))
  return values
}
