<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button />
      </ion-buttons>
      <ion-title>Filtrar</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    {{ content }}
  </ion-content>
</template>

<script lang="ts" setup>
import { toRefs, ref } from 'vue'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue'
const props = defineProps({
  title: {
    type: String,
    default: 'Super Modal'
  }
})

const { title } = toRefs(props)
const content = ref('Content')
</script>
