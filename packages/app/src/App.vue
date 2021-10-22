<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useSqlite from './composables/useSqlite'

const { getInstance } = useSqlite()

console.log('TRIODJASIOJ')
getInstance()
  .then(db => {
    db.exportToJson('full')
      .then(res => {
        console.log('EXPORT', res)
      })
  })
/*
executeSQL<any>('SELECT * FROM model limit 100')
  .then((rows: any) => {
    console.log('ROWS', rows)
  })
*/

/*
import useFipe from './composables/useFipe'

const { getModels } = useFipe()
getModels({ fields: ['id', 'makeId', 'name'], limit: 10 })
  .then(models => {
    console.log('MODELS', models)
  })
*/
</script>
