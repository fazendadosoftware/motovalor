<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    {{ content }}
  </ion-content>
</template>

<script lang="ts" setup>
import { toRefs, ref } from 'vue'
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/vue'
const props = defineProps({
  title: {
    type: String,
    default: 'Super Modal'
  }
})

const { title } = toRefs(props)
const content = ref('Content')
</script>
