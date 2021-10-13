"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelYearSchema {
    constructor(modelId, modelYear, prices) {
        if (!Number.isNaN(modelId))
            this.model = { id: modelId };
        if (typeof modelYear === 'number')
            this.year = modelYear;
        if (prices !== undefined)
            this.prices = prices;
    }
}
exports.default = ModelYearSchema;
ModelYearSchema.schema = {
    name: 'ModelYear',
    properties: {
        model: 'Model',
        year: 'int',
        prices: 'int{}'
    }
};
//# sourceMappingURL=ModelYearSchema.js.map