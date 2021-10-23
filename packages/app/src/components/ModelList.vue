<template>
  <ion-list>
    <ion-item
      v-for="(model, i) in models"
      :key="rowKey ?? i"
    >
      <ion-label>
        <div class="flex text-xs">
          <div class="flex flex-col">
            <div class="text-sm">
              {{ model.make }}
            </div>
            <div class="font-bold">
              {{ model.model }}
            </div>
          </div>
          <div class="flex-1" />
          <div class="flex flex-col items-center justify-center">
            {{ model?.modelYears?.join(', ') }}
          </div>
        </div>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script lang="ts" setup>
import { toRefs, PropType } from 'vue'
import { IonList, IonItem, IonLabel } from '@ionic/vue'
import { VModel } from '../composables/useFipe'

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
