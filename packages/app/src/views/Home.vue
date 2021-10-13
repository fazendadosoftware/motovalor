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

        <ion-title>Models</ion-title>
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
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, IonMenuButton, modalController } from '@ionic/vue'
import { optionsOutline } from 'ionicons/icons'
import Modal from '@/components/ModelsFilterModal'
import ModelList from '@/components/ModelList'

const openFilterModal = async () => {
  const modal = await modalController
    .create({ component: Modal, componentProps: { title: 'TITLEEfewfewE' } })
  return modal.present()
}

const searchQuery = ref('')
</script>
