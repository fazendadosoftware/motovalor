export type TableId = number

export default class FipeTable {
  public id?: number = -1
  public date?: number = -1

  constructor (id?: number, date?: number) {
    if (id !== undefined) this.id = id
    if (date !== undefined) this.date = date
  }
}
