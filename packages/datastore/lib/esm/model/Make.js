import { v3 } from 'murmurhash';
import Model from './Model';
const MAKE_SEED = 3210809412;
export default class Make {
    constructor(name) {
        if (name !== undefined) {
            this.name = name.toUpperCase();
            this.id = v3(this.name, MAKE_SEED);
        }
    }
    static fromRow(row, makeColumnIndex) {
        const makeName = row[makeColumnIndex];
        const make = new Make(makeName);
        return make;
    }
    static getKeys() {
        return Object.keys(new Make(''));
    }
}
Make.schema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        models: {
            type: 'linkingObjects',
            objectType: Model.schema.name,
            property: 'make'
        }
    }
};
//# sourceMappingURL=Make.js.map