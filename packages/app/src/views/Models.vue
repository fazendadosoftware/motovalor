<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <back-button to="home" />
        </ion-buttons>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img class="h-9" src="../../public/assets/img/motovalor_logo.svg">
        </div>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="filterOutline" />
          </ion-button>
          <ion-button @click="router.push({ name: 'filters'})">
            <ion-icon slot="icon-only" :icon="optionsOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-searchbar
      v-model="searchQuery"
      :disabled="totalCount === null"
      :debounce="250"
      :placeholder="totalCount === null ? 'Search models' : `Search ${totalCount} model${totalCount === 1 ? '' : 's'}`" />
    <ion-content :fullscreen="false">
      <ion-list lines="full" class="pt-0">
        <dynamic-scroller
          v-slot="{ item, index, active }"
          class="h-full"
          :items="models"
          :min-item-size="10"
          key-field="id">
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
        id="infinite-scroll"
        threshold="90%"
        :disabled="!hasNextPage"
        @ionInfinite="loadData($event)">
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data..." />
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButtons, IonButton, IonBackButton, IonIcon, modalController, IonInfiniteScrollContent, IonInfiniteScroll, IonList } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { filterOutline, optionsOutline, chevronBackOutline } from 'ionicons/icons'
import ModelListItem from '@/components/ModelListItem.vue'
import ModelsFilterModal from '@/components/ModelsFilterModal.vue'
import ModelsSortModal from '@/components/ModelsSortModal.vue'
import BackButton from '@/components/BackButton.vue'
import useModels from '@/composables/useModels'

const router = useRouter()
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
