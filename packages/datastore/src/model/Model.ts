import { v3 } from 'murmurhash'
import Realm from 'realm'
import ModelYear from './ModelYear'
import Make from './Make'

const MODEL_ID_SEED = 982034890

const modelKeyIndex = {
  makeId: 'Marca',
  fipeCode: 'CodigoFipe',
  vehicleTypeCode: 'TipoVeiculo',
  fuelTypeCode: 'SiglaCombustivel',
  name: 'Modelo'
}

export type VehicleTypeCode = 1 | 2 | 3
export type FuelTypeCode = 'A' | 'D' | 'G'
export default class Model {
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
