import Realm from 'realm'

export type VehicleTypeCode = 1 | 2 | 3
export type FuelTypeCode = 'A' | 'D' | 'G'

export interface Make {
  id: number
  name?: string
  models?: Realm.Results<Model>
  schema: Realm.ObjectSchema
  create (name: string): Make
}

export interface Model {
  id: number
  // eslint-disable-next-line no-use-before-define
  make?: Make
  vehicleTypeCode?: VehicleTypeCode
  name?: string
  fipeCode?: string
  fuelTypeCode?: FuelTypeCode
  modelYears?: Realm.Results<ModelYear>

  translateFuelType: (input: any) => FuelTypeCode
  schema: Realm.ObjectSchema
  getModelFieldIndexes: (columns: string[]) => any
  getModelIdString: (model: Model & { makeId: string }) => string
  fromRow: (row: any, modelKeys: (string | number)[][], makeId: number) => Model
}

export interface ModelYear {
  model: Model
  year: number
  prices: Record<number, number> | number[]
  price?: number
  delta1M?: number
  delta3M?: number
  delta6M?: number
  delta12M?: number
  delta24M?: number
  delta36M?: number

  static schema: Realm.ObjectSchema

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
