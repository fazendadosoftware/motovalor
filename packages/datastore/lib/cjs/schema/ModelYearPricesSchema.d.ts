import Realm from 'realm';
export default class ModelYearPricesSchema {
    prices: Record<string, number>;
    static schema: Realm.ObjectSchema;
}
