<template>
  <ion-list>
    <ion-item
      v-for="(model, i) in models"
      :key="i"
    >
      <ion-label>{{ model?.make }} {{ model?.model }}</ion-label>
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

getModels({ vehicleTypeCode: [2], limit: 100, zeroKm: false })
  .then(_models => {
    models.value = _models
    console.log('MODELS', models.value)
  })

</script>
