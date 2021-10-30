<template>
  <div>
    <vehicle-type-selector />
    <vehicle-condition-segment v-model="vehicleCondition" />
    {{ vehicleCondition }}
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import VehicleTypeSelector from '@/components/VehicleTypeSelector.vue'
import VehicleConditionSegment from '@/components/VehicleConditionSegment.vue'

const vehicleCondition: Ref<'used' | 'new'> = ref('used')
</script>
