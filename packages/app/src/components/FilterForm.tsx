import React, { useState } from 'react'
import { View, Text } from 'react-native'
import VehicleTypeSelector from './VehicleTypeSelector'
import Button from './Button'
import MakeSelector from './MakeSelector'
import ModelYearFormGroup from './ModelYearFormGroup'
import PriceFormGroup from './PriceFormGroup'

const FilterForm = () => {
  const [used, setUsed] = useState<boolean>(true)
  const [vehicleTypes, setVehicleTypes] = useState<Set<1 | 2 | 3>>(new Set())

  const onVehicleTypeSelected = (vehicleType: 1 | 2 | 3) => {
    vehicleTypes.has(vehicleType) ? vehicleTypes.delete(vehicleType) : vehicleTypes.add(vehicleType)
    setVehicleTypes(new Set([...vehicleTypes]))
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <Button model={!used} label="Novos" onPress={() => setUsed(false)} disabled={!used} containerStyle={{ marginRight: 5 }} />
        <Button model={used} label="Usados" onPress={() => setUsed(true)} disabled={used} containerStyle={{ marginLeft: 5 }} />
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Tipos de Veículo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <VehicleTypeSelector vehicleTypes={vehicleTypes} onPress={onVehicleTypeSelected}/>
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Fabricantes
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MakeSelector />
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Ano do Modelo
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <ModelYearFormGroup />
        </View>
      </View>
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>
          Preço
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <PriceFormGroup />
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ padding: 40}}>
        <Button title="Ver 125 modelos" />
      </View>
    </View>
  )
}

export default FilterForm
