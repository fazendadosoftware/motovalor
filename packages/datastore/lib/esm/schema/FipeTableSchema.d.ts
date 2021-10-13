import Realm from 'realm';
export declare type TableId = number;
export default class FipeTableSchema {
    id?: number;
    date?: Date | string;
    constructor(id?: number, date?: string);
    static schema: Realm.ObjectSchema;
}
