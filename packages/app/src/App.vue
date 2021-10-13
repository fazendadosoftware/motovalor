<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useSqlite from './composables/useSqlite'

const { executeSQL } = useSqlite()

executeSQL<any>('SELECT * FROM model limit 100')
  .then((rows: any) => {
    console.log('ROWS', rows)
  })
</script>
