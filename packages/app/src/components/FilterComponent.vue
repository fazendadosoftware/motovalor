<template>
  <div class="h-full p-6 space-y-8 flex flex-col items-center">
    <vehicle-type-selector v-model="vehicleTypeIds" />
    <vehicle-condition-segment v-model="vehicleCondition" />
    <div class="text-xs text-gray-400 italic flex items-center">
      Makers select will be a searchable modal (searchbar + list)
    </div>
    <div class="text-xs text-gray-400 italic">
      Fuel Type Code select will be a searchable modal (searchbar + list)
    </div>
    <div class="text-xs text-gray-400 italic">
      Year Range (min, max)
    </div>
    <div class="text-xs text-gray-400 italic">
      Price Range (min, max)
    </div>
    <div class="flex-1" />
    <div>
      {{ vehicleCondition }}
      {{ vehicleTypeIds }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import VehicleTypeSelector from '@/components/VehicleTypeSelector.vue'
import VehicleConditionSegment from '@/components/VehicleConditionSegment.vue'

const vehicleCondition: Ref<'used' | 'new'> = ref('used')
const vehicleTypeIds = ref([1, 2, 3])
</script>
