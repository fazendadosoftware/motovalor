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
    <ion-searchbar
      v-model="searchQuery"
      :disabled="totalCount === null"
      :debounce="250"
      :placeholder="totalCount === null ? 'Search models' : `Search ${totalCount} model${totalCount === 1 ? '' : 's'}`"/>
    <ion-content :fullscreen="false">
      <ion-list lines="full">
        <dynamic-scroller
          class="h-full"
          :items="models"
          :min-item-size="10"
          key-field="id"
          v-slot="{ item, index, active }">
          <dynamic-scroller-item
            :item="item"
            :active="active"
            :size-dependencies="[]"
            :data-index="index">
            <model-list-item :model="item" />
          </dynamic-scroller-item>
        </dynamic-scroller>
      </ion-list>
      <ion-infinite-scroll
        @ionInfinite="loadData($event)" 
        threshold="90%"
        id="infinite-scroll"
        :disabled="!hasNextPage">
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, modalController, IonInfiniteScrollContent, IonInfiniteScroll, IonList } from '@ionic/vue'
import { filterOutline, optionsOutline } from 'ionicons/icons'
import ModelListItem from '@/components/ModelListItem.vue'
import ModelsFilterModal from '@/components/ModelsFilterModal.vue'
import ModelsSortModal from '@/components/ModelsSortModal.vue'
import useModels from '@/composables/useModels'

const { searchQuery, models, fetchNextModelPage, hasNextPage, totalCount } = useModels()

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

const loadData = async (evt: any) => {
  try {
    await fetchNextModelPage()
  } finally {
    evt.target.complete()
  }
}
</script>
