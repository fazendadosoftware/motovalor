<template>
  <div
    class="flex space-x-4 transition duration-200 ease-in-out"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <vehicle-type-avatar
      v-for="vehicleTypeId in vehicleTypeIds"
      :key="vehicleTypeId"
      :vehicle-type-id="vehicleTypeId"
      class="h-10 w-10 rounded-full shadow-md"
      :class="{
        'cursor-pointer': !disabled
      }"
      :background-color="getAvatarBackgroundColor(vehicleTypeId)"
      @click="disabled ? undefined : toggleSelection(vehicleTypeId)" />
  </div>
</template>

<script lang="ts" setup>
import { toRefs, unref, PropType } from 'vue'
import VehicleTypeAvatar from '@/components/VehicleTypeAvatar.vue'

type VehicleTypeId = 1 | 2 | 3

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: Array as PropType<VehicleTypeId[]>, required: true },
  disabled: Boolean
})
const { modelValue, disabled } = toRefs(props)

const vehicleTypeIds: Array<VehicleTypeId> = [1, 2, 3]

const toggleSelection = (vehicleTypeId: VehicleTypeId) => {
  const idx = unref(modelValue).indexOf(vehicleTypeId)
  if (idx > -1) unref(modelValue).splice(idx, 1)
  else unref(modelValue).push(vehicleTypeId)
  emit('update:modelValue', unref(modelValue))
}

const getAvatarBackgroundColor = (vehicleTypeId: VehicleTypeId) => {
  const idx = unref(modelValue).indexOf(vehicleTypeId)
  const backgroundColor = idx > -1 ? undefined : '#a0aec0'
  return backgroundColor
}
</script>
