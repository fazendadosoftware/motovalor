"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFTSIndexFromDatabase = exports.updateDatabaseFromData = exports.openRealm = void 0;
const tslib_1 = require("tslib");
const realm_1 = (0, tslib_1.__importStar)(require("realm"));
const fuse_js_1 = (0, tslib_1.__importDefault)(require("fuse.js"));
const model_1 = require("./model");
const bson_1 = require("bson");
const openRealm = async (path) => {
    const realm = await (0, realm_1.open)({ path, schema: (0, model_1.getFipeSchema)() });
    return realm;
};
exports.openRealm = openRealm;
const windowYearSize = 3;
const deltaPriceIndexes = model_1.ModelYear.getDeltaMonthIndexesSet(5);
const updateDatabaseFromData = async (realm, data) => {
    const { fipeTables, makes, models, modelYears } = data;
    const tableDates = fipeTables
        .map(({ date }) => date)
        .sort()
        .reverse()
        .slice(0, windowYearSize * 12 + 1);
    realm.beginTransaction();
    try {
        makes.forEach(make => realm.create(model_1.Make.schema.name, make, realm_1.default.UpdateMode.All));
        models.forEach(model => realm.create(model_1.Model.schema.name, model, realm_1.default.UpdateMode.All));
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
            modelYear.id = new bson_1.ObjectId();
            modelYear.prices = prices;
            modelYear.price = prices[0];
            const deltaFields = model_1.ModelYear.getDeltaFields(deltas);
            // @ts-ignore
            Object.entries(deltaFields).forEach(([key, value]) => { modelYear[key] = value; });
            realm.create(model_1.ModelYear.schema.name, modelYear, realm_1.default.UpdateMode.All);
        });
        realm.commitTransaction();
    }
    catch (error) {
        realm.cancelTransaction();
        throw error;
    }
};
exports.updateDatabaseFromData = updateDatabaseFromData;
const buildFTSIndexFromDatabase = async (realm) => {
    const models = realm.objects(model_1.Model.name)
        .map(model => model.toJSON())
        .map(model => ({ ...model, modelYears: Object.keys(model.modelYears) }));
    return fuse_js_1.default.createIndex(['make', 'name', 'modelYears'], models).toJSON();
};
exports.buildFTSIndexFromDatabase = buildFTSIndexFromDatabase;
//# sourceMappingURL=realm.js.map