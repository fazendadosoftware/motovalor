import { Make, Model, ModelYear } from 'datastore/src/model'
export { Make, Model, ModelYear }

export interface IModelYearFilter {
  _: number
  ftsQuery: string
  zeroKm: boolean
  vehicleTypeIds: Set<1 | 2 | 3>
  makeIndex: Record<number, Make>
}

export interface IFipe {
  _: number
  makes: Record<number, Make>,
}

export interface Action<T,P> {
  type: T
  payload: P
}
