import Realm from 'realm'
import murmurhash from 'murmurhash'
import ModelSchema from './ModelSchema'

export default class MakeSchema {
  public id: number
  public name: string
  public models?: ModelSchema[]

  constructor (name: string) {
    this.name = name.toUpperCase()
    this.id = murmurhash.v3(name)
  }

  static schema: Realm.ObjectSchema = {
    name: 'Make',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      models: {
        type: 'linkingObjects',
        objectType: ModelSchema.schema.name,
        property: 'make'
      }
    }
  }
}
