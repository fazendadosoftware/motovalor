import React, { useState, useCallback, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTheme, Button, ButtonGroup } from 'react-native-elements'
import MakeFormGroup from './MakeFormGroup'
import ModelYearFormGroup from './ModelYearFormGroup'
import PriceFormGroup from './PriceFormGroup'
import VehicleTypeIcon from './VehicleTypeIcon'
import useFipeState from '../hooks/useFipeState'

const FilterForm = () => {
  const fipeState = useFipeState()
  const { theme } = useTheme()
  const [modelYearCount, setModelYearCount] = useState<number | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setModelYearCount(fipeState.actions.fetchFilteredModelYears().length), [fipeState.state.modelYearFilter])

  const setZeroKm = useCallback((zeroKm: boolean) => {
    fipeState.state.modelYearFilter.zeroKm.set(zeroKm)
  }, [fipeState.state.modelYearFilter.zeroKm])

  const setVehicleTypeId = useCallback((vehicleTypeId: 1 | 2 | 3) => {
    const { selectedVehicleTypeIndex } = fipeState.state.modelYearFilter
    const { [vehicleTypeId]: isSet, ...selectedVehicleTypes } = selectedVehicleTypeIndex.get()
    selectedVehicleTypeIndex.set(isSet ? selectedVehicleTypes : { ...selectedVehicleTypes, [vehicleTypeId]: true })
  }, [fipeState.state.modelYearFilter])

  return (
    <View style={ { backgroundColor: theme.colors?.grey5, flex: 1 } }>
      <View style={ { padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline } }>
        <ButtonGroup
          selectedIndex={ fipeState.state.modelYearFilter.zeroKm.get() ? 0 : 1 }
          onPress={ selectedIndex => setZeroKm(selectedIndex === 0) }
          buttons={ ['Novos', 'Usados'] }
        />
      </View>
      <View style={ { padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline } }>
        <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 10 } }>
          Tipos de Veículo
        </Text>
        <ButtonGroup
          buttons={
            [1, 2, 3]
              .map((vehicleTypeCode) => (
                <VehicleTypeIcon
                  vehicleTypeCode={ vehicleTypeCode as 1 | 2 | 3 }
                  size={ 32 }
                  backgroundColor="transparent"
                  color={ fipeState.state.modelYearFilter.selectedVehicleTypeIndex.get()[vehicleTypeCode as 1 | 2 | 3] ? theme.colors?.white : theme.colors?.primary }
                />)
              )
          }
          selectedIndexes={ Object.keys(fipeState.state.modelYearFilter.selectedVehicleTypeIndex.get()).map(id => parseInt(id, 10) - 1) }
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          onPress={ selectedIndex => setVehicleTypeId(selectedIndex + 1) }
        />
      </View>
      <View style={ { padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline } }>
        <MakeFormGroup />
      </View>
      <View style={ { padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline } }>
        <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 10 } }>
          Ano do Modelo
        </Text>
        <View style={ { flexDirection: 'row', justifyContent: 'center' } }>
          <ModelYearFormGroup />
        </View>
      </View>
      <View style={ { padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline } }>
        <Text style={ { fontSize: 12, fontWeight: 'bold', marginBottom: 10 } }>
          Preço
        </Text>
        <View style={ { flexDirection: 'row', justifyContent: 'center' } }>
          <PriceFormGroup />
        </View>
      </View>
      <View style={ { flex: 1 } } />
      <View style={ { flexDirection: 'row', justifyContent: 'center', padding: 30 } }>
        <Button title={ `Pesquisar ${modelYearCount ?? 'null'} preços` } containerStyle={ { flex: 1 } }/>
      </View>
    </View>
  )
}

export default FilterForm
