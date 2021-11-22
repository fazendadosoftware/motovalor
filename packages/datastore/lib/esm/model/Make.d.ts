import Realm from 'realm';
import Model from './Model';
export default class Make {
    id: number;
    name: string;
    models: Realm.Results<Model> | null;
    constructor(id?: number);
    static schema: Realm.ObjectSchema;
    static create(name: string): Make;
}
