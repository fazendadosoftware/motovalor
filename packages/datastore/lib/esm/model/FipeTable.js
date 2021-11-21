export default class FipeTable {
    constructor(id, date) {
        this.id = -1;
        this.date = -1;
        if (id !== undefined)
            this.id = id;
        if (date !== undefined)
            this.date = date;
    }
}
FipeTable.schema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
        id: 'int',
        date: 'int'
    }
};
//# sourceMappingURL=FipeTable.js.map