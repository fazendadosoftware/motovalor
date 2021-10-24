import { VehicleTypeCode, FuelTypeCode } from 'datastore/src/model/Model'
export { VehicleTypeCode, FuelTypeCode }

/**
* Creates an instance of a view model entry.
*/
export default class VModel {
  public id?: number = -1
  public make?: string = ''
  public modelId?: number = -1
  public model?: string = ''
  public vehicleTypeCode?: VehicleTypeCode = 1
  public fuelTypeCode?: FuelTypeCode = 'G'
  public fipeCode?: string = ''
  public refDate?: number = -1
  public modelYear?: number = -1
  public modelYears?: number[] = []
  public price?: number = -1
  public deltaPrice12M?: number | null = -1
  public prices?: number[] = []
  public deltaPrices?: number[] = []

  static getTableName () {
    return 'models'
  }

  static getKeys (): string[] {
    return Object.keys(new VModel()).filter(key => key[0] !== '_')
  }

  static getId (modelId: number, modelYear: number) {
    return modelId * 1E5 + modelYear
  }

  static mapFromSql (row: any, fields: (keyof VModel)[] | null = null): VModel {
    const vmodel = (fields ?? this.getKeys())
      .reduce((accumulator: VModel, key) => ({ ...accumulator, [key]: row[key] }), {})
    if (typeof vmodel.prices === 'string') vmodel.prices = JSON.parse(vmodel.prices)
    if (typeof vmodel.deltaPrices === 'string') vmodel.deltaPrices = JSON.parse(vmodel.deltaPrices)
    if (typeof vmodel.modelYears === 'string') vmodel.modelYears = JSON.parse(vmodel.modelYears)
    return vmodel
  }
}
