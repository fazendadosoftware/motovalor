<template>
  <ion-segment @ionChange="segmentChanged($event)" :value="'used'">
    <ion-segment-button :value="'new'">
      <ion-label>Novos</ion-label>
    </ion-segment-button>
    <ion-segment-button :value="'used'">
      <ion-label>Usados</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: String
})

const { modelValue } = toRefs(props)

// @ts-expect-error
const segmentChanged = (evt: CustomEvent) => emit('update:modelValue', evt?.target?.value)
</script>
