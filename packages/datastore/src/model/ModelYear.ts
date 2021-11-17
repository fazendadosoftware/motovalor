import { ObjectSchema } from 'realm'
import Model from './Model'
export default class ModelYear {
  public modelId: number = -1
  public model?: Model
  public year: number = -1
  public prices: Record<number, number> | number[] = {}
  public deltaPrices?: number[]

  constructor (modelId: number, year: number, prices?: Record<number, number>) {
    this.modelId = modelId
    this.year = year
    if (prices !== undefined) this.prices = prices
  }

  static schema: ObjectSchema = {
    name: 'ModelYear',
    properties: {
      model: 'Model',
      year: { type: 'int', indexed: true },
      prices: 'int[]',
      deltaPrices: 'int[]'
    }
  }

  public putPrice (dateIndex: number | string, value: number) {
    this.prices[dateIndex] = value
  }

  static getModelYearPKey = (modelYear: ModelYear) => (`${modelYear.modelId}_${modelYear.year}`)

  static getKeys (): string[] {
    return Object.keys(new ModelYear(-1, -1, {}))
  }

  static getJsonKeys (): string[] {
    return ['prices']
  }
}
