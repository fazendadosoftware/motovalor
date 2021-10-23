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

        <ion-title>Homex</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false">
      <div class="flex flex-col h-full">
        <ion-searchbar
          v-model="searchQuery"
          :debounce="500"/>
        <model-list
          :models="rows"
          key="modelId"
          class="flex-1 overflow-y-auto" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, unref, watch, computed } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, modalController } from '@ionic/vue'
import { optionsOutline } from 'ionicons/icons'
import Modal from '@/components/ModelsFilterModal.vue'
import ModelList from '@/components/ModelList.vue'
import useFipe from '@/composables/useFipe'
import { VModel } from '../composables/useFipe'
// @ts-ignore
import fuseWorker from 'workerize-loader!../workers/fuse'

const ftsInstance = fuseWorker()

const { getModels } = useFipe()
const rows = ref<VModel[]>([])
const searchQuery = ref<string>('')
const reloading = ref(false)

const buildFtsIndex = async () => {
  reloading.value = true
  try {
    const models = await getModels({ fields: ['modelId', 'model', 'make', 'vehicleTypeCode', 'fuelTypeCode', 'modelYears'] })
    await ftsInstance.setCollection(models)
    rows.value = await ftsInstance.search()
  } finally {
    reloading.value = false
  }
}

watch(searchQuery, async searchQuery => { rows.value = await ftsInstance.search(searchQuery) })

const openFilterModal = async () => {
  const modal = await modalController
    .create({ component: Modal, componentProps: { title: 'Model Filter' } })
  return modal.present()
}

buildFtsIndex()

</script>
