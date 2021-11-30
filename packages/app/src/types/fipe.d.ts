import Realm from 'realm'
import { Make, Model, ModelYear } from 'datastore/src/model'
export { Make, Model, ModelYear }

export type VehicleTypeCode = 1 | 2 | 3
export interface ModelYearFilter {
  _: number
  zeroKm: boolean
  selectedVehicleTypeIndex: Partial<Record<VehicleTypeCode, true>>
  selectedMakeIndex: Record<number, Make>
}
