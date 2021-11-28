import React, { useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTheme, Button, ButtonGroup } from 'react-native-elements'
import MakeFormGroup from './MakeFormGroup'
import ModelYearFormGroup from './ModelYearFormGroup'
import PriceFormGroup from './PriceFormGroup'
import { useFipeContext } from '../context/fipe'
import { FipeActionType } from '../context/fipe/types.d'
import VehicleTypeIcon from './VehicleTypeIcon'

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
      <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <ButtonGroup
          selectedIndex={fipeContext.state.modelYearFilter.zeroKm ? 0 : 1}
          onPress={selectedIndex => setZeroKm(selectedIndex === 0)}
          buttons={['Novos', 'Usados']}
        />
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Tipos de Veículo
        </Text>
        <ButtonGroup
          buttons={
            [1, 2, 3]
              .map((vehicleTypeCode) => (
                <VehicleTypeIcon
                  vehicleTypeCode={vehicleTypeCode as 1 | 2 | 3}
                  size={32}
                  backgroundColor="transparent"
                  color={fipeContext.state.modelYearFilter.vehicleTypeIds.has(vehicleTypeCode as 1 | 2 | 3) ? theme.colors?.white : theme.colors?.primary}
                />)
              )
          }
          selectedIndexes={[...fipeContext.state.modelYearFilter.vehicleTypeIds].map(id => id - 1)}
          onPress={selectedIndex => setVehicleTypeId(selectedIndex + 1)}
        />
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
        <Button title="Ver 125 modelos" containerStyle={{ flex: 1 }}/>
      </View>
    </View>
  )
}

export default FilterForm
