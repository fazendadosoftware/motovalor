import Realm from 'realm'

export type TableId = number

export default class FipeTableSchema {
  public id?: number = -1
  public date?: Date | string = new Date().toISOString().split('T')[0]

  constructor (id?: number, date?: string) {
    if (id !== undefined) this.id = id
    if (date !== undefined) this.date = date
  }

  public static schema: Realm.ObjectSchema = {
    name: 'FipeTable',
    primaryKey: 'id',
    properties: {
      id: 'int',
      date: 'date'
    }
  }
}
