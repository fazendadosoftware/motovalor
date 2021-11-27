import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from 'react-native-elements'
import VehicleTypeSelector from './VehicleTypeSelector'
import Button from './Button'
import MakeFormGroup from './MakeFormGroup'
import ModelYearFormGroup from './ModelYearFormGroup'
import PriceFormGroup from './PriceFormGroup'
import useModelYearFilter from '../hooks/useModelYearFilter'

const FilterForm = () => {
  const { theme } = useTheme()
  const { modelYearFilter, setZeroKm, setVehicleTypeId } = useModelYearFilter()

  return (
    <View style={{ backgroundColor: theme.colors?.grey5, flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Button
          model={modelYearFilter.zeroKm}
          label="Novos"
          onPress={() => setZeroKm(true)}
          disabled={modelYearFilter.zeroKm}
          containerStyle={{ marginRight: 5 }}
        />
        <Button
          model={!modelYearFilter.zeroKm}
          label="Usados"
          onPress={() => setZeroKm(false)}
          disabled={!modelYearFilter.zeroKm}
          containerStyle={{ marginLeft: 5 }}
        />
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors?.greyOutline }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Tipos de Veículo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <VehicleTypeSelector vehicleTypes={modelYearFilter.vehicleTypeIds} onPress={setVehicleTypeId}/>
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
