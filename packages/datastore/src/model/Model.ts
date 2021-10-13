import { v3 } from 'murmurhash'
export type ModelYear = string

const MODEL_ID_SEED = 982034890

const modelKeyIndex = {
  makeId: 'Marca',
  fipeCode: 'CodigoFipe',
  vehicleTypeCode: 'TipoVeiculo',
  fuelTypeCode: 'SiglaCombustivel',
  name: 'Modelo'
}

export default class Model {
  public id: number = -1
  public makeId: number = -1
  public vehicleTypeCode: 1 | 2 | 3 = 1
  public name: string = ''
  public fipeCode: string = ''
  public fuelTypeCode: 'A' | 'D' | 'G' = 'G'

  static FUEL_TYPE_DICTIONARY = {
    G: 'G',
    D: 'D',
    Á: 'A'
  }

  static getModelFieldIndexes (columns: string[]) {
    const modelKeys = Object.entries(modelKeyIndex)
      .map(([key, label]) => ([key, columns.indexOf(label)]))

    const priceColIndex = columns.indexOf('Valor')
    const modelYearColumnIndex = columns.indexOf('AnoModelo')
    const makeColumnIndex = columns.indexOf('Marca')

    return { makeColumnIndex, modelKeys, priceColIndex, modelYearColumnIndex }
  }

  static getModelIdString = (model: Model) => `${model.makeId} ${model.name} ${model.fuelTypeCode}`.replace(/ /g, '_')

  static fromRow (row: any, modelKeys: (string | number)[][], makeId: number): Model {
    const model: Model = modelKeys.reduce((accumulator: any, [key, idx]) => ({ ...accumulator, [key]: row[idx] }), {})
    if (model.name !== undefined) model.name = model.name.toUpperCase()
    model.id = v3(Model.getModelIdString(model), MODEL_ID_SEED)
    model.makeId = makeId
    if (model.fuelTypeCode !== undefined) {
      // @ts-ignore
      const ftCode = Model.FUEL_TYPE_DICTIONARY[model.fuelTypeCode]
      if (ftCode === undefined) throw Error(`Invalid fuel type code ${model.fuelTypeCode}`)
      model.fuelTypeCode = ftCode
    }
    return model
  }

  static getKeys (): string[] {
    return Object.keys(new Model())
  }
}
