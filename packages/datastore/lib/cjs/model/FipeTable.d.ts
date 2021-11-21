import { ObjectSchema } from 'realm';
export declare type TableId = number;
export default class FipeTable {
    id?: number;
    date?: number;
    constructor(id?: number, date?: number);
    static schema: ObjectSchema;
}
