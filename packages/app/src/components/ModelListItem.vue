<template>
  <ion-item>
    <ion-label>
      <div class="flex text-xs">
        <div class="flex flex-col">
          <div class="text-sm">
            {{ model.make }}
          </div>
          <div class="font-bold">
            {{ model.model }} {{model.modelYear}} {{ model.fuelTypeCode}}
          </div>
        </div>
        <div class="flex-1" />
        <div class="flex flex-col items-center justify-center">
          {{ model?.price }} {{ model?.deltaPrice12M }}
        </div>
      </div>
    </ion-label>
  </ion-item>
</template>

<script lang="ts" setup>
import { toRefs, PropType } from 'vue'
import { IonItem, IonLabel } from '@ionic/vue'
import { VModel } from '../composables/useFipe'

const props = defineProps({
  model: {
    type: Object as PropType<VModel>,
    required: true
  }
})

const { model } = toRefs(props)
</script>