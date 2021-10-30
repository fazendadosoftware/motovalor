<template>
  <ion-page>
    <ion-progress-bar v-if="isIndexing" type="indeterminate" />
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button auto-hide="false" />
        </ion-buttons>
        <ion-title>
          <div class="flex justify-center">
            <img class="h-9" src="../../public/assets/img/motovalor_logo_full.svg">
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :scroll-y="false">
      <div class="h-full flex items-center justify-center space-x-2">
        <button
          class="border border-gray-200 p-4 rounded-md shadow-md bg-gray-200 cursor-pointer"
          @click="() => router.push({ name: 'models' })">
          Modelos
        </button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import useModels from '@/composables/useModels'
import { IonPage, IonHeader, IonContent, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonProgressBar } from '@ionic/vue'
const router = useRouter()
const { isIndexing } = useModels()
</script>
