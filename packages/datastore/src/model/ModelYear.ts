export default class ModelYear {
  public modelId: number = -1
  public year: number = -1
  public prices: Record<number, number> = {}

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
