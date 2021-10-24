<template>
  <ion-list :lines="'inset'">
    <dynamic-scroller
      class="h-full"
      :items="models"
      :min-item-size="30"
      key-field="_key"
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
</template>

<script lang="ts" setup>
import { toRefs, PropType } from 'vue'
import { IonList, IonItem, IonLabel } from '@ionic/vue'
import { VModel } from '@/composables/useFipe'
import ModelListItem from '@/components/ModelListItem.vue'

const props = defineProps({
  models: {
    type: Object as PropType<VModel[]>,
    required: true
  },
  rowKey: {
    type: String as PropType<(keyof VModel)>,
    required: false
  }
})

const { models } = toRefs(props)
</script>
