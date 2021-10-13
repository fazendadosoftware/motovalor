import { v3 } from 'murmurhash'

const MAKE_SEED = 3210809412

export default class Make {
  public id: number
  public name: string

  constructor (name: string) {
    this.name = name.toUpperCase()
    this.id = v3(this.name, MAKE_SEED)
  }

  static fromRow (row: any, makeColumnIndex: number): Make {
    const makeName = row[makeColumnIndex]
    const make = new Make(makeName)
    return make
  }

  static getKeys (): string[] {
    return Object.keys(new Make(''))
  }
}
