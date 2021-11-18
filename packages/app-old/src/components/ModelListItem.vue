<template>
  <ion-item-sliding>
    <ion-item :detail="true" :style="style">
      <div slot="start" class="mr-4">
        <vehicle-type-avatar
          svg-classes="w-12"
          :vehicle-type-id="model.vehicleTypeCode ?? 0"/>
      </div>
      <div class="w-full flex flex-col py-2">
        <div class="text-sm font-thin italic">
          {{model.make}}
        </div>
        <div class="text-sm font-semibold leading-6">
          {{ model.model }}
        </div>
        <div class="flex items-start justify-between mt-1 mr-2">
          <div class="text-gray-500 text-2xl leading-10 italic">
            {{model.modelYear === 32000 ? '0km' : model.modelYear}}
          </div>
          <div class="flex flex-col items-end space-y-0">
            <div class="text-2xl text-gray-800 dark:text-white font-black px-0.5 rounded leading-10">
              {{currencyFilter(model.price)}}
            </div>
            <div v-if="model.deltaPrice12M !== undefined">
              <span class="text-tiny italic">último ano: </span>
              <span
                class="text-xs font-bold px-1 py-0.5 rounded-md text-white"
                :class="{
                  'bg-green-600': (model?.deltaPrice12M ?? 0) > 0,
                  'bg-red-600': (model?.deltaPrice12M ?? 0) < 0
                }">
                {{currencyFilter(model.deltaPrice12M)}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option>Chart</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script lang="ts" setup>
import { toRefs, PropType, ref, unref, Ref, onBeforeUnmount, computed } from 'vue'
import { IonItemSliding, IonItem, IonItemOptions, IonItemOption } from '@ionic/vue'
import VehicleTypeAvatar from '@/components/VehicleTypeAvatar.vue'
import { VModel } from '@/composables/useFipe'
import currencyFilter from '@/filters/currency'

const props = defineProps({
  model: {
    type: Object as PropType<VModel>,
    required: true
  }
})

const { model } = toRefs(props)
const darkMode: Ref<boolean> = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const style = computed(() => {
  const style = []
  if (unref(darkMode)) style.push('--border-color: #ffffff20')
  const backgroundColors = ['#38A16920', '#D53F8C20', '#D69E2E20']
  style.push(`--background: ${backgroundColors[(model.value?.vehicleTypeCode ?? -1) - 1]}`)
  return style.join(';')
})

// listen for dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { darkMode.value = e.matches })
onBeforeUnmount(() => { window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => { darkMode.value = e.matches }) })
</script>
