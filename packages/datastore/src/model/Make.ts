import { v3 } from 'murmurhash'
import { ObjectSchema } from 'realm'
import Model from './Model'

const MAKE_SEED = 3210809412

export default class Make {
  public id: number
  public name?: string

  constructor (name?: string) {
    if (name !== undefined) {
      this.name = name.toUpperCase()
      this.id = v3(this.name, MAKE_SEED)
    }
  }

  static schema: ObjectSchema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      models: {
        type: 'linkingObjects',
        objectType: Model.schema.name,
        property: 'make'
      }
    }
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
