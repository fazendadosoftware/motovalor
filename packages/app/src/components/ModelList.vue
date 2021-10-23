<template>
  <ion-list>
    <ion-item
      v-for="(model, i) in models"
      :key="i"
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
import { ref } from 'vue'
import { IonList, IonItem, IonLabel } from '@ionic/vue'
import useFipe from '@/composables/useFipe'
import { VModel } from '../composables/useFipe'

const { getModels } = useFipe()
const models = ref<VModel[]>([])

getModels({ fields: ['model', 'make', 'modelYears'], vehicleTypeCode: [2], limit: 100, zeroKm: false, sort: [{ key: 'make' }, { key: 'model' }] })
  .then(_models => {
    models.value = _models
    console.log('MODELS', models.value)
  })

</script>
