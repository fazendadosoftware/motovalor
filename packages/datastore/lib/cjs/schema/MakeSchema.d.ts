import Realm from 'realm';
import ModelSchema from './ModelSchema';
export default class MakeSchema {
    id: number;
    name: string;
    models?: ModelSchema[];
    constructor(name: string);
    static schema: Realm.ObjectSchema;
}
