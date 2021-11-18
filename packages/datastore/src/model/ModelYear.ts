import { ObjectSchema } from 'realm'
import Model from './Model'
export default class ModelYear {
  public modelId: number = -1
  public model?: Model
  public year: number = -1
  public prices: Record<number, number> | number[] = {}

  constructor (modelId: number, year: number, prices?: Record<number, number>) {
    this.modelId = modelId
    this.year = year
    if (prices !== undefined) this.prices = prices
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

export interface ModelYearDeltas {
  delta1M?: number
  delta3M?: number
  delta6M?: number
  delta12M?: number
  delta24M?: number
  delta36M?: number
}
export class ModelYearSchema extends ModelYear {
  public price: number
  public delta1M?: number
  public delta3M?: number
  public delta6M?: number
  public delta12M?: number
  public delta24M?: number
  public delta36M?: number

  static schema: ObjectSchema = {
    name: 'ModelYear',
    properties: {
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
    }
  }

  // 1M, 3M, 6M, 12M, 24M, 36M, 48M
  static getDeltaMonthIndexesSet = (windowYearSize: number) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
    .map(year => year === 0 ? [1, 3, 6] : year * 12).flat())

  static getDeltaFields (deltaPrices: number[]) {
    const deltaMonthIndexes = [1, 3, 6, 12, 24, 36]
    const deltaFields = deltaPrices
      .slice(0, deltaMonthIndexes.length)
      .reduce((accumulator: ModelYearDeltas, deltaPrice, i) => {
        accumulator[`delta${deltaMonthIndexes[i]}M`] = deltaPrice
        return accumulator
      }, {})
    return deltaFields
  }
}
