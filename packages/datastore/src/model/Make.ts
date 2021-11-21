import { v3 } from 'murmurhash'
import Realm from 'realm'
import Model from './Model'

const MAKE_SEED = 3210809412

export default class Make {
  public id: number = -1
  public name: string = ''
  public models: Realm.Results<Model> = null

  constructor (id?: number) {
    if (id !== undefined) this.id = id
  }

  static schema: Realm.ObjectSchema = {
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

  static create (name: string): Make {
    const make = new Make()
    make.name = name
    make.id = v3(name, MAKE_SEED)
    return make
  }
}
