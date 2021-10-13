<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts" setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import useSqlite from './composables/useSqlite'

const { getInstance } = useSqlite()
getInstance()
  .then(async db => {
    const res = await db.query('SELECT * FROM USERS LIMIT 2')
    console.log('@ USERS', res)
  })
const doQuery = async () => {
  const db = await getInstance()
  const res = await db.query('SELECT * FROM USERS')
  console.log('USERS', res)
}
doQuery()
</script>
