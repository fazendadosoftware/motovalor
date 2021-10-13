import Realm from 'realm'
import ModelSchema from './ModelSchema'

export type ModelYear = string
export default class ModelYearSchema {
  public model?: ModelSchema
  public year?: number
  public prices?: Record<string, number>

  constructor (modelId?: number, modelYear?: number, prices?: Record<string, number>) {
    if (!Number.isNaN(modelId)) this.model = { id: modelId }
    if (typeof modelYear === 'number') this.year = modelYear
    if (prices !== undefined) this.prices = prices
  }

  static schema: Realm.ObjectSchema = {
    name: 'ModelYear',
    properties: {
      model: 'Model',
      year: 'int',
      prices: 'int{}'
    }
  }
}
