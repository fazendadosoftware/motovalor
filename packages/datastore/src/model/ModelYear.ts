import Realm from 'realm'
import Model from './Model'

export interface ModelYearDeltas {
  delta1M?: number
  delta3M?: number
  delta6M?: number
  delta12M?: number
  delta24M?: number
  delta36M?: number
}

export default class ModelYear {
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
        // @ts-expect-error
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
