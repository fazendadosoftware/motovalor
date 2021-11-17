import { ObjectSchema } from 'realm'
export type TableId = number

export default class FipeTable {
  public id?: number = -1
  public date?: number = -1

  constructor (id?: number, date?: number) {
    if (id !== undefined) this.id = id
    if (date !== undefined) this.date = date
  }

  public static schema: ObjectSchema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
      id: 'int',
      date: 'int'
    }
  }
}
