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
        <model-list :models="rows" class="flex-1 overflow-y-auto" />
      </div>
          <ion-infinite-scroll
        @ionInfinite="loadData($event)" 
        threshold="100px" 
        id="infinite-scroll"
        :disabled="isDisabled"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, modalController, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue'
import { filterOutline, optionsOutline } from 'ionicons/icons'
import ModelsFilterModal from '@/components/ModelsFilterModal.vue'
import ModelsSortModal from '@/components/ModelsSortModal.vue'
import ModelList from '@/components/ModelList.vue'
import useFipe, { VModel } from '@/composables/useFipe'
import useModels from '@/composables/useModels'

const { searchQuery, rows } = useModels()

const { getModels } = useFipe()

const isDisabled = ref(false)

const loadData = (evt: any) => {
  console.log('LOADING')
  setTimeout(() => {
    evt.target.complete()
    console.log('DONE...')
  }, 1000)
}


// watch(searchQuery, async searchQuery => { rows.value = await ftsInstance.search(searchQuery) })

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

</script>
