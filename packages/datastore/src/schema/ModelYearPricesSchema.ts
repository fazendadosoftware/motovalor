import Realm from 'realm'

export default class ModelYearPricesSchema {
  public prices: Record<string, number>
  static schema: Realm.ObjectSchema = {
    name: 'ModelYearPrices',
    embedded: true,
    properties: {
      prices: 'int{}'
    }
  }
}
