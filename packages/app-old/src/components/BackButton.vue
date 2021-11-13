<template>
  <ion-button @click="router.push({ name: to })">
    <ion-icon slot="icon-only" :icon="close ? closeOutline : chevronBackOutline" />
  </ion-button>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { IonButton, IonIcon } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { chevronBackOutline, closeOutline } from 'ionicons/icons'
const router = useRouter()

const props = defineProps({
  to: { type: String, required: true },
  close: { type: Boolean, required: false }
})

const { to } = toRefs(props)
</script>
