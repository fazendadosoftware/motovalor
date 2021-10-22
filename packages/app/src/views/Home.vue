<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <!--
        <ion-buttons slot="start">
          <ion-menu-button auto-hide="false" />
        </ion-buttons>
        -->
        <ion-buttons slot="primary">
          <ion-button @click="() => openFilterModal()">
            <ion-icon
              slot="icon-only"
              :icon="optionsOutline"
            />
          </ion-button>
        </ion-buttons>

        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar v-model="searchQuery" />
      <model-list />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, modalController } from '@ionic/vue'
import { optionsOutline } from 'ionicons/icons'
import Modal from '@/components/ModelsFilterModal.vue'
import ModelList from '@/components/ModelList.vue'

const openFilterModal = async () => {
  const modal = await modalController
    .create({ component: Modal, componentProps: { title: 'Model Filter' } })
  return modal.present()
}

const searchQuery = ref('')
</script>
