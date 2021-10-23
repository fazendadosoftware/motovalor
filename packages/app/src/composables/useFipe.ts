import useSqlite from './useSqlite'
import VModel, { VehicleTypeCode, FuelTypeCode } from 'datastore/src/model/VModel'
export { VModel, VehicleTypeCode, FuelTypeCode }

const { executeSQL } = useSqlite()

export type FipeTable = {
  id: number
  date: Date | string
}

type ModelSortingKey = 'price' | 'deltaPrice12M' | 'modelYear' | 'model' | 'make'

interface GetModelsProps {
  fields?: (keyof VModel)[]
  fipeCode?: string[]
  make?: string[]
  vehicleTypeCode?: VehicleTypeCode[]
  fuelTypeCode?: FuelTypeCode[]
  modelYear?: { min?: number | null, max?: number | null }
  price?: { min?: number | null, max?: number | null }
  // filter models that are still being sold (modelYear code === 32000)
  zeroKm?: boolean
  limit?: number
  offset?: number,
  sort?: { key: ModelSortingKey, asc?: boolean }[]
}

const getModels = async (props: GetModelsProps) => {
  const fieldsStatement = (props?.fields ?? []).join(', ') || '*'

  const rangePropFields: (keyof GetModelsProps)[] = ['modelYear', 'price']
  const arrayPropFields: (keyof GetModelsProps)[] = ['fipeCode', 'make', 'vehicleTypeCode', 'fuelTypeCode']

  const where: string[] = []

  arrayPropFields
    // @ts-expect-error
    .filter(key => (Array.isArray(props[key]) && props[key].length > 0))
    // @ts-expect-error
    .forEach(key => where.push(`${key} IN (${props[key]?.map((value: string | number) => typeof value === 'string' ? `"${value}"` : value).join(',')})`))

  rangePropFields
    .forEach(key => {
      // @ts-expect-error
      const { min = null, max = null } = props[key] ?? {}
      if (min !== null && max !== null) where.push(`${key} BETWEEN ${min} AND ${max}`)
      else if (min !== null) where.push(`${key} >= ${min}`)
      else if (max !== null) where.push(`${key} <= ${max}`)
    })

  if (props.zeroKm !== undefined) where.push(`modelYear ${props.zeroKm === true ? '=' : '!='} 32000`)

  const whereStatement = where.length ? ` WHERE ${where.join(' AND ')}` : ''

  const limitStatement = props.limit ? ` LIMIT ${props.limit}` : ''
  const offsetStatement = typeof props.offset === 'number' ? ` OFFSET ${props.offset}` : ''
  const orderStatement = Array.isArray(props.sort)
    // ? ` ORDER BY ${props.sort?.key} ${props.sort?.asc ? 'ASC' : 'DESC'}`
    ? ` ORDER BY ${Array.isArray(props.sort) ? props.sort.map(({ key, asc = null }) => `${key}${asc === null ? '' : asc === true ? 'ASC' : 'DESC'}`) : ''}`
    : ''
  const groupByStatement = (props?.fields?.indexOf('modelYears') ?? -1) > -1 ? ' GROUP BY modelId' : ''

  const frags = [whereStatement, groupByStatement, orderStatement, limitStatement, offsetStatement].join('')
  const sqlStatement = `SELECT ${fieldsStatement} FROM ${VModel.getTableName()}${frags}`
  console.log('SQL STATEMENT', sqlStatement)
  const models = await executeSQL<VModel>(sqlStatement)
    .then(rows => rows.map(row => VModel.mapFromSql(row, props.fields)))

  return models
}

const useFipe = () => ({
  getModels
})

export default useFipe
