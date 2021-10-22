import { VehicleTypeCode, FuelTypeCode } from 'datastore/src/model/Model'
export { VehicleTypeCode, FuelTypeCode }

/**
* Creates an instance of a view model entry.
*/
export default class VModel {
  public makeId?: number = -1
  public make?: string = ''
  public modelId?: number = -1
  public model?: string = ''
  public vehicleTypeCode?: VehicleTypeCode = 1
  public fuelTypeCode?: FuelTypeCode = 'G'
  public fipeCode?: string = ''
  public refDate?: number = -1
  public modelYear?: number = -1
  public price?: number = -1
  public deltaPrice12M?: number | null = -1
  public prices?: number[] = []
  public deltaPrices?: number[] = []

  static getTableName () {
    return 'models'
  }

  static getKeys (): string[] {
    return Object.keys(new VModel())
  }

  static mapFromSql (row: any, fields: (keyof VModel)[] | null = null): VModel {
    const vmodel = (fields ?? Object.keys(new VModel()))
      .reduce((accumulator: VModel, key) => ({ ...accumulator, [key]: row[key] }), {})
    if (typeof vmodel.prices === 'string') vmodel.prices = JSON.parse(vmodel.prices)
    if (typeof vmodel.deltaPrices === 'string') vmodel.deltaPrices = JSON.parse(vmodel.deltaPrices)
    return vmodel
  }
}
