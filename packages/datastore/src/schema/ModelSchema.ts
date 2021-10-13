import Realm from 'realm'
import MakeSchema from './MakeSchema'
import ModelYearSchema from './ModelYearSchema'
import murmurhash from 'murmurhash'

export type ModelYear = string

const modelKeyIndex = {
  make: 'Marca',
  fipeCode: 'CodigoFipe',
  vehicleTypeCode: 'TipoVeiculo',
  fuelTypeCode: 'SiglaCombustivel',
  name: 'Modelo'
}

export default class ModelSchema {
  public id: number = -1
  public make?: MakeSchema
  public vehicleTypeCode?: 1 | 2 | 3
  public name?: string
  public fipeCode?: string
  public fuelTypeCode?: 'A' | 'D' | 'G'
  public modelYears?: ModelYearSchema[]
  static FUEL_TYPE_DICTIONARY = {
    G: 'G',
    D: 'D',
    Á: 'A'
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
        objectType: ModelYearSchema.schema.name,
        property: 'model'
      }
    }
  }

  static getModelFieldIndexes (columns: string[]) {
    const modelKeys = Object.entries(modelKeyIndex)
      .map(([key, label]) => ([key, columns.indexOf(label)]))

    const priceColIndex = columns.indexOf('Valor')
    const modelYearIndex = columns.indexOf('AnoModelo')

    return { modelKeys, priceColIndex, modelYearIndex }
  }

  static getModelIdString = (model: ModelSchema) => `${model?.make?.name} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_')

  static fromRow (row: any, modelKeys: (string | number)[][]): ModelSchema {
    const model: ModelSchema = modelKeys.reduce((accumulator: any, [key, idx]) => ({ ...accumulator, [key]: row[idx] }), {})
    // @ts-ignore
    model.make = new MakeSchema(model.make)
    if (model.name !== undefined) model.name = model.name.toUpperCase()
    model.id = murmurhash.v3(ModelSchema.getModelIdString(model))
    if (model.fuelTypeCode !== undefined) {
      // @ts-ignore
      const ftCode = ModelSchema.FUEL_TYPE_DICTIONARY[model.fuelTypeCode]
      if (ftCode === undefined) throw Error(`Invalid fuel type code ${model.fuelTypeCode}`)
      model.fuelTypeCode = ftCode
    }
    return model
  }
}
