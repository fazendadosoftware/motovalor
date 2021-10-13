"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FipeTableSchema {
    constructor(id, date) {
        if (id !== undefined)
            this.id = id;
        if (date !== undefined)
            this.date = date;
    }
}
exports.default = FipeTableSchema;
FipeTableSchema.schema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: 'date'
    }
};
//# sourceMappingURL=FipeTableSchema.js.map