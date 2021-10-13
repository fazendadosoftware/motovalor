import murmurhash from 'murmurhash';
import ModelSchema from './ModelSchema';
export default class MakeSchema {
    constructor(name) {
        this.name = name.toUpperCase();
        this.id = murmurhash.v3(name);
    }
}
MakeSchema.schema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        models: {
            type: 'linkingObjects',
            objectType: ModelSchema.schema.name,
            property: 'make'
        }
    }
};
//# sourceMappingURL=MakeSchema.js.map