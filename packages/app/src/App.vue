<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useSqlite from './composables/useSqlite'

const { getInstance} = useSqlite()
getInstance()
  .then(async db => {
    console.log(await db.isDBOpen(), await db.isExists())
    const res = await db.query('SELECT * FROM fipeTable limit 100')
    console.log('@ TABLES', res)
  })
</script>
