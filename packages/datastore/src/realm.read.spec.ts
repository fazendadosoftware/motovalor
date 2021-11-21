import test, { ExecutionContext } from 'ava'
import Realm from 'realm'
import { join } from 'path'
import { existsSync } from 'fs'
import { Make, Model, ModelYear } from './model'

const DATAPATH = join(__dirname, '..', '.realm')
const REALM_FILENAME = 'fipe.realm'

interface Context {
  realm: Realm
}

test.before(async (t: ExecutionContext<Context>) => {
  if (!existsSync(DATAPATH)) throw Error('could not find database folder')
  t.context.realm = await Realm.open({ path: join(DATAPATH, REALM_FILENAME), schema: [Make, Model, ModelYear] })
})

test.serial('it updates database from indexes file', async (t: ExecutionContext<Context>) => {
  const makes = t.context.realm.objects<Make>(Make.schema.name)
  const models = t.context.realm.objects<Model>(Model.schema.name)
  const modelYears = t.context.realm.objects<Model>(ModelYear.schema.name)
  for (const make of makes) {
    const _models = make.models.map(({ name }) => name)
    console.log('models', _models)
  }
  console.log('MAKES', makes.length)
  console.log('MODELS', models.length)
  console.log('MODEL YEARS', modelYears.length)
  for (const make of makes) {
    console.log('MAKE', make.models)
  }
  t.pass()
})

test.after((t: ExecutionContext<Context>) => {
  t.context.realm.close()
})
