import Realm, { open } from 'realm';
import Fuse from 'fuse.js';
import { Make, Model, ModelYear } from './model';
export const openRealm = async (path) => {
    const realm = await open({ path, schema: [Make, Model, ModelYear] });
    return realm;
};
const windowYearSize = 3;
const deltaPriceIndexes = ModelYear.getDeltaMonthIndexesSet(5);
export const updateDatabaseFromData = async (realm, data) => {
    const { fipeTables, makes, models, modelYears } = data;
    const tableDates = fipeTables
        .filter(({ date }) => isNaN(date ?? -1))
        .map(({ date }) => date)
        .sort()
        .reverse()
        .slice(0, windowYearSize * 12 + 1);
    realm.beginTransaction();
    try {
        makes
            .forEach(make => realm.create(Make.schema.name, make, Realm.UpdateMode.All));
        models
            .forEach(model => {
            realm.create(Model.schema.name, model, Realm.UpdateMode.All);
        });
        const getPreviousPrice = (i, tableDates, modelYearPrices) => {
            if (modelYearPrices[tableDates[i]] === undefined && (i + 1) < tableDates.length)
                return getPreviousPrice(i + 1, tableDates, modelYearPrices);
            else
                return modelYearPrices[tableDates[i]] ?? null;
        };
        modelYears
            .filter(modelYear => !isNaN(modelYear.prices[tableDates?.[0] ?? -1])) // filter modelYears with price listing for the latest table...
            .forEach(modelYear => {
            const { prices, deltas } = tableDates
                .reduce((accumulator, date, i) => {
                const price = modelYear.prices[date ?? -1] ?? getPreviousPrice(i, tableDates, modelYear.prices);
                if (price === null)
                    return accumulator;
                accumulator.prices.push(price);
                if (deltaPriceIndexes.has(i)) {
                    const delta = (accumulator.prices[0] / price) - 1;
                    accumulator.deltas.push(delta);
                    accumulator.deltaPrices.push(accumulator.prices[0] - price);
                }
                return accumulator;
            }, { prices: [], deltaPrices: [], deltas: [] });
            modelYear.model.id = modelYear.modelId;
            modelYear.prices = prices;
            modelYear.price = prices[0];
            const deltaFields = ModelYear.getDeltaFields(deltas);
            // @ts-ignore
            Object.entries(deltaFields).forEach(([key, value]) => { modelYear[key] = value; });
            realm.create(ModelYear.schema.name, modelYear, Realm.UpdateMode.All);
        });
        realm.commitTransaction();
    }
    catch (error) {
        realm.cancelTransaction();
        throw error;
    }
};
export const buildFTSIndexFromDatabase = async (realm) => {
    const models = realm.objects(Model.name)
        .map(model => model.toJSON())
        .map(model => ({ ...model, modelYears: Object.keys(model.modelYears) }));
    return Fuse.createIndex(['make', 'name', 'modelYears'], models).toJSON();
};
//# sourceMappingURL=realm.js.map