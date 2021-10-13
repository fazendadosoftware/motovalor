import useSqlite from './useSqlite'
import Model, { VehicleTypeCode, FuelTypeCode } from 'datastore/src/model/Model'

const { executeSQL } = useSqlite()

export type FipeTable = {
  id: number
  date: Date | string
}

interface GetModelsProps {
  fields?: (keyof Model)[]
  fipeCodes?: string[]
  makes?: string[]
  vehicleTypeCodes?: VehicleTypeCode[]
  fuelTypeCodes?: FuelTypeCode[]
  modelYears?: { min?: number, max?: number }
  // filter models that are still being sold (modelYear code === 32000)
  zeroKm: boolean | null
  limit: number
  offset?: number
}

const COMPUTED_MODEL_FIELDS: Record<keyof Model, string | null> = {
  id: null,
  makeId: null,
  // make: null,
  vehicleTypeCode: null,
  name: null,
  fipeCode: null,
  fuelTypeCode: null
  // prices: null,
  // modelYears: '(SELECT group_concat(key) from json_each(prices)) as modelYears',
  // productionYearCount: '(SELECT COUNT(key) from json_each(prices) WHERE key != "32000") as productionYearCount'
}

const getModels = async (props: GetModelsProps = { zeroKm: null, limit: 10, fields: [] }) => {
  const fieldsStatement = (props?.fields ?? [])
    .reduce((accumulator: string[], field) => {
      const sqlStatement = COMPUTED_MODEL_FIELDS[field] ?? field
      accumulator.push(sqlStatement)
      return accumulator
    }, []).join(',') || '*'

  const where: string[] = []

  if (Array.isArray(props.fipeCodes)) {
    where.push(`fipeCode IN (${props.fipeCodes.map(code => `"${code}"`).join(',')})`)
  }
  if (Array.isArray(props.makes)) {
    where.push(`make IN (${props.makes.map(make => `"${make}"`).join(',')})`)
  }
  if (Array.isArray(props.vehicleTypeCodes)) {
    where.push(`vehicleTypeCode IN (${props.vehicleTypeCodes.join(',')})`)
  }
  if (Array.isArray(props.fuelTypeCodes)) {
    where.push(`fuelTypeCode IN (${props.fuelTypeCodes.map(fuelTypeCode => `"${fuelTypeCode}"`).join(',')})`)
  }
  if (props.modelYears) {
    const { min = null, max = null } = props.modelYears
    if (min !== null) where.push(`(SELECT min(key) from json_each(prices) WHERE key IS NOT "32000") >= "${min}"`)
    if (max !== null) where.push(`(SELECT max(key) from json_each(prices) WHERE key IS NOT "32000") <= "${max}"`)
  }
  if (props.zeroKm !== null) {
    where.push(`(SELECT EXISTS(SELECT value from json_each(prices) WHERE key = "32000")) = ${props.zeroKm === true ? 1 : 0}`)
  }

  const whereStatement = where.length ? ` WHERE ${where.join(' AND ')}` : ''

  const limitStatement = ` LIMIT ${props.limit}`
  const offsetStatement = !Number.isNaN(props.offset) ? ` OFFSET ${props.offset}` : ''

  const sqlStatement = `SELECT ${fieldsStatement} FROM model${whereStatement}${limitStatement}${offsetStatement}`
  const models = await executeSQL<Model>(sqlStatement)

  return models
}

const useFipe = () => ({
  getModels
})

export default useFipe
