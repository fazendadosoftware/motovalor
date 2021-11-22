import { v3 } from 'murmurhash';
import Model from './Model';
const MAKE_SEED = 3210809412;
export default class Make {
    constructor(id) {
        this.id = -1;
        if (id !== undefined)
            this.id = id;
    }
    static create(name) {
        const make = new Make();
        make.name = name;
        make.id = v3(name, MAKE_SEED);
        return make;
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