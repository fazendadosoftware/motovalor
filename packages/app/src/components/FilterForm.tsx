import React, { useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from 'react-native-elements'
import VehicleTypeSelector from './VehicleTypeSelector'
import Button from './Button'
import MakeFormGroup from './MakeFormGroup'
import ModelYearFormGroup from './ModelYearFormGroup'
import PriceFormGroup from './PriceFormGroup'
import { useFipeContext } from '../context/fipe'
import { FipeActionType } from '../context/fipe/types.d'

const FilterForm = () => {
  const fipeContext = useFipeContext()
  const { theme } = useTheme()

  const setZeroKm = useCallback((zeroKm: boolean) => {
    const { modelYearFilter } = fipeContext.state
    modelYearFilter.zeroKm = true
    fipeContext.dispatch?.({ type: FipeActionType.SetModelYearFilter, payload: { ...modelYearFilter, zeroKm } })
  }, [fipeContext])

  const setVehicleTypeId = useCallback((vehicleTypeId: 1 | 2 | 3) => {
    fipeContext.dispatch?.({ type: FipeActionType.ToggleModelYearFilterVehicleTypeId, payload: vehicleTypeId })
  }, [fipeContext])

  useEffect(() => {
    console.log('MODEL YER FILTER CHANGED', fipeContext.state.modelYearFilter)
  }, [fipeContext.state.modelYearFilter._])

  return (
    <View style={{ backgroundColor: theme.colors?.grey5, flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Button
          model={fipeContext.state.modelYearFilter.zeroKm}
          label="Novos"
          onPress={() => setZeroKm(true)}
          disabled={fipeContext.state.modelYearFilter.zeroKm}
          containerStyle={{ marginRight: 5 }}
        />
        <Button
          model={!fipeContext.state.modelYearFilter.zeroKm}
          label="Usados"
          onPress={() => setZeroKm(false)}
          disabled={!fipeContext.state.modelYearFilter.zeroKm}
          containerStyle={{ marginLeft: 5 }}
        />
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Tipos de Veículo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <VehicleTypeSelector vehicleTypes={fipeContext.state.modelYearFilter.vehicleTypeIds} onPress={setVehicleTypeId}/>
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <MakeFormGroup />
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Ano do Modelo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ModelYearFormGroup />
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Preço
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <PriceFormGroup />
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 30 }}>
        <Button model={true} label="Ver 125 modelos" containerStyle={{ flex: 1 }}/>
      </View>
    </View>
  )
}

export default FilterForm
