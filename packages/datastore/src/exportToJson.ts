import { Database } from 'sqlite'
import { writeFileSync } from 'fs'

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
        const [,,, value] = regex.exec(sql.replace(/\r\n/g, ''))
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
    .then(rows => rows.map(row => columnNames.map(column => row[column])))
  return values
}

// https://stackoverflow.com/questions/4060475/parsing-sql-create-table-statement-using-jquery
// https://github.com/capacitor-community/sqlite/blob/master/android/src/main/java/com/getcapacitor/community/database/sqlite/SQLite/ImportExportJson/ExportToJson.java
// https://github.com/jepiqueau/vue-sqlite-app-starter/blob/main/src/utils/utils-import-from-json.ts

export const exportToJson = async (db: Database, outputFile: string) => {
  const schema = await getSchema(db)
  const indexes = await Promise.all(schema.map(async ({ name }) => await getIndexes(db, name)))
  const triggers = await Promise.all(schema.map(async ({ name }) => await getTriggers(db, name)))
  const values = await Promise.all(schema.map(async ({ name }) => await getValues(db, name)))
  const tables = schema.map((schema, i) => ({ ...schema, indexes: indexes[i], triggers: triggers[i], values: values[i] }))
  const data = {
    database: 'fipe',
    version: 1,
    encrypted: false,
    mode: 'full',
    tables
  }
  writeFileSync(outputFile, JSON.stringify(data))
}
