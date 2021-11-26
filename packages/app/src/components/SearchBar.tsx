import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'

export interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Search' }) => {
  console.log('VALUE', value.length)

  return (
    <View style={ styles.searchView }>
      <View style={ styles.inputView }>
        <TextInput
          value={value}
          style={styles.input}
          placeholder={placeholder}
          onChangeText={onChangeText}
        />
        { value.length === 0 ? (
          <TouchableOpacity>
            <Icon name='search' size={ 24 } color='#333' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={ () => onChangeText?.('') }>
            <Icon name='cancel' size={ 24 } color='#333' />
          </TouchableOpacity>
        ) }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  }
})

export default SearchBar
