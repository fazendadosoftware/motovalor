import { ObjectSchema } from 'realm';
export default class Make {
    id: number;
    name?: string;
    constructor(name?: string);
    static schema: ObjectSchema;
    static fromRow(row: any, makeColumnIndex: number): Make;
    static getKeys(): string[];
}
