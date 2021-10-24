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
          <ion-button @click="() => openSortModalModal()">
            <ion-icon
              slot="icon-only"
              :icon="filterOutline"
            />
          </ion-button>
          <ion-button @click="() => openFilterModal()">
            <ion-icon
              slot="icon-only"
              :icon="optionsOutline"
            />
          </ion-button>
        </ion-buttons>

        <ion-title>
          Motovalor
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false">
      <div class="flex flex-col h-full">
        <ion-searchbar
          v-model="searchQuery"
          :debounce="250"/>
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
import { filterOutline, optionsOutline } from 'ionicons/icons'
import ModelsFilterModal from '@/components/ModelsFilterModal.vue'
import ModelsSortModal from '@/components/ModelsSortModal.vue'
import ModelList from '@/components/ModelList.vue'
import useFipe from '@/composables/useFipe'
import { VModel } from '../composables/useFipe'
// @ts-ignore
import ftsWorker from 'workerize-loader!../workers/flexsearch'

const ftsInstance = ftsWorker()

const { getModels } = useFipe()
const rows = ref<VModel[]>([])
const searchQuery = ref<string>('')
const reloading = ref(false)

const buildFtsIndex = async () => {
  reloading.value = true
  try {
    const models = await getModels({
      fields: ['modelId', 'model', 'make', 'vehicleTypeCode', 'fuelTypeCode', 'modelYear', 'price', 'deltaPrice12M'],
      sort: [{ key: 'make' }, { key: 'model' }, { key: 'modelYear', asc: false }]
    })
    rows.value = await ftsInstance.setCollection(models)
  } finally {
    reloading.value = false
  }
}

watch(searchQuery, async searchQuery => { rows.value = await ftsInstance.search(searchQuery) })

const openFilterModal = async () => {
  const modal = await modalController
    .create({ component: ModelsFilterModal, componentProps: { title: 'Filtrar' } })
  return modal.present()
}

const openSortModalModal = async () => {
  const modal = await modalController
    .create({ component: ModelsSortModal, componentProps: { title: 'Ordenar port' } })
  return modal.present()
}

buildFtsIndex()

</script>
