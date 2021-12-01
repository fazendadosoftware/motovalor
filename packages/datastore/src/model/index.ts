import { v3 } from 'murmurhash'
import Realm, { ObjectSchema } from 'realm'
import { ObjectId } from 'bson'

const MODEL_ID_SEED = 982034890
const MAKE_SEED = 3210809412

export type TableId = number

export class FipeTable {
  public id?: number = -1
  public date?: number = -1

  constructor (id?: number, date?: number) {
    if (id !== undefined) this.id = id
    if (date !== undefined) this.date = date
  }

  public static schema: ObjectSchema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
      id: 'int',
      date: 'int'
    }
  }
}

export interface ModelYearDeltas {
  delta1M?: number
  delta3M?: number
  delta6M?: number
  delta12M?: number
  delta24M?: number
  delta36M?: number
}

export class ModelYear {
  public id: ObjectId = new ObjectId()
  public model: Model = new Model()
  public year: number = -1
  public prices: Record<number, number> | number[] = {}
  public price?: number
  public delta1M?: number
  public delta3M?: number
  public delta6M?: number
  public delta12M?: number
  public delta24M?: number
  public delta36M?: number

  static schema: Realm.ObjectSchema = {
    name: 'ModelYear',
    properties: {
      id: 'objectId',
      model: 'Model',
      year: { type: 'int', indexed: true },
      price: 'int',
      prices: 'int[]',
      delta1M: 'float?',
      delta3M: 'float?',
      delta6M: 'float?',
      delta12M: 'float?',
      delta24M: 'float?',
      delta36M: 'float?'
    },
    primaryKey: 'id'
  }

  // 1M, 3M, 6M, 12M, 24M, 36M, 48M
  static getDeltaMonthIndexesSet = (windowYearSize: number) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
    .map(year => year === 0 ? [1, 3, 6] : year * 12).flat())

  static getDeltaFields (deltaPrices: number[]) {
    const deltaMonthIndexes = [1, 3, 6, 12, 24, 36]
    const deltaFields = deltaPrices
      .slice(0, deltaMonthIndexes.length)
      .reduce((accumulator: ModelYearDeltas, deltaPrice, i) => {
        //@ts-expect-error
        accumulator[`delta${deltaMonthIndexes[i]}M`] = deltaPrice
        return accumulator
      }, {})
    return deltaFields
  }

  constructor (modelId: number, year: number, prices?: Record<number, number>) {
    this.model = new Model(modelId)
    this.year = year
    if (prices !== undefined) this.prices = prices
  }

  public putPrice (dateIndex: number | string, value: number) {
    if (typeof dateIndex === 'string') dateIndex = parseInt(dateIndex)
    this.prices[dateIndex] = value
  }

  static getModelYearPKey = (modelYear: ModelYear) => (`${modelYear.model.id}_${modelYear.year}`)

  static getKeys (): string[] {
    return Object.keys(new ModelYear(-1, -1, {}))
  }

  static getJsonKeys (): string[] {
    return ['prices']
  }
}

const modelKeyIndex = {
  makeId: 'Marca',
  fipeCode: 'CodigoFipe',
  vehicleTypeCode: 'TipoVeiculo',
  fuelTypeCode: 'SiglaCombustivel',
  name: 'Modelo'
}

export type VehicleTypeCode = 1 | 2 | 3
export type FuelTypeCode = 'A' | 'D' | 'G'
export class Model {
  public id: number = -1
  public make?: Make
  public vehicleTypeCode?: VehicleTypeCode
  public name?: string
  public fipeCode?: string
  public fuelTypeCode?: FuelTypeCode
  public modelYears?: Realm.Results<ModelYear>

  constructor (id?: number) {
    if (id !== undefined) this.id = id
  }

  static translateFuelType = (input: any): FuelTypeCode => {
    if (typeof input !== 'string') throw Error(`invalid fuel type code ${input}`)
    const normalizedInput = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '') as FuelTypeCode
    if (['A', 'G', 'D'].indexOf(normalizedInput) < 0) throw Error(`invalid fuel type code ${normalizedInput}`)
    return normalizedInput
  }

  static schema: Realm.ObjectSchema = {
    name: 'Model',
    primaryKey: 'id',
    properties: {
      id: 'int',
      make: 'Make',
      vehicleTypeCode: 'int',
      name: 'string',
      fipeCode: 'string',
      fuelTypeCode: 'string',
      modelYears: {
        type: 'linkingObjects',
        objectType: ModelYear.schema.name,
        property: 'model'
      }
    }
  }

  static getModelFieldIndexes (columns: string[]) {
    const modelKeys = Object.entries(modelKeyIndex)
      .map(([key, label]) => ([key, columns.indexOf(label)]))

    const priceColIndex = columns.indexOf('Valor')
    const modelYearColumnIndex = columns.indexOf('AnoModelo')
    const makeColumnIndex = columns.indexOf('Marca')

    return { makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex }
  }

  static getModelIdString = (model: Model & { makeId: string }) => `${model.makeId} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_')

  static fromRow (row: any, modelKeys: (string | number)[][], makeId: number): Model {
    const model: any = modelKeys.reduce((accumulator: any, [key, idx]) => ({ ...accumulator, [key]: row[idx] }), {})
    if (model.name !== undefined) model.name = model.name.toUpperCase()
    model.id = v3(Model.getModelIdString(model), MODEL_ID_SEED)
    model.make = new Make(makeId)
    if (model.fuelTypeCode !== undefined) {
      const ftCode = Model.translateFuelType(model.fuelTypeCode)
      if (ftCode === undefined) throw Error(`Invalid fuel type code ${model.fuelTypeCode}`)
      model.fuelTypeCode = ftCode
    }
    delete model.makeId
    return model
  }
}

export class Make {
  public id: number = -1
  public name?: string
  public models?: Realm.Results<Model>

  constructor (id?: number) {
    if (id !== undefined) this.id = id
  }

  static schema: Realm.ObjectSchema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      models: {
        type: 'linkingObjects',
        objectType: Model.schema.name,
        property: 'make'
      }
    }
  }

  static create (name: string): Make {
    const make = new Make()
    make.name = name
    make.id = v3(name, MAKE_SEED)
    return make
  }
}

const getFipeSchema = () => ([Make.schema, Model.schema, ModelYear.schema])
export { getFipeSchema }
