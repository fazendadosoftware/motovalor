"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FipeTable = /** @class */ (function () {
    function FipeTable(id, date) {
        this.id = -1;
        this.date = -1;
        if (id !== undefined)
            this.id = id;
        if (date !== undefined)
            this.date = date;
    }
    FipeTable.schema = {
        name: 'FipeTable',
        primaryKey: 'id',
        properties: {
            id: 'int',
            date: 'int'
        }
    };
    return FipeTable;
}());
exports.default = FipeTable;
//# sourceMappingURL=FipeTable.js.map