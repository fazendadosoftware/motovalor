export default class ModelYear {
    constructor(modelId, year, prices) {
        this.modelId = -1;
        this.year = -1;
        this.prices = {};
        this.modelId = modelId;
        this.year = year;
        if (prices !== undefined)
            this.prices = prices;
    }
    static getDeltaFields(deltaPrices) {
        const deltaMonthIndexes = [1, 3, 6, 12, 24, 36];
        const deltaFields = deltaPrices
            .slice(0, deltaMonthIndexes.length)
            .reduce((accumulator, deltaPrice, i) => {
            accumulator[`delta${deltaMonthIndexes[i]}M`] = deltaPrice;
            return accumulator;
        }, {});
        return deltaFields;
    }
    putPrice(dateIndex, value) {
        this.prices[dateIndex] = value;
    }
    static getKeys() {
        return Object.keys(new ModelYear(-1, -1, {}));
    }
    static getJsonKeys() {
        return ['prices'];
    }
}
ModelYear.schema = {
    name: 'ModelYear',
    properties: {
        model: 'Model',
        year: { type: 'int', indexed: true },
        price: 'int',
        prices: 'int[]',
        delta1M: 'float?',
        delta3M: 'float?',
        delta6M: 'float?',
        delta12M: 'float?',
        delta24M: 'float?',
        delta36M: 'float?'
    }
};
// 1M, 3M, 6M, 12M, 24M, 36M, 48M
ModelYear.getDeltaMonthIndexesSet = (windowYearSize) => new Set([...Array(Math.ceil(windowYearSize)).keys()]
    .map(year => year === 0 ? [1, 3, 6] : year * 12).flat());
ModelYear.getModelYearPKey = (modelYear) => (`${modelYear.modelId}_${modelYear.year}`);
//# sourceMappingURL=ModelYear.js.map