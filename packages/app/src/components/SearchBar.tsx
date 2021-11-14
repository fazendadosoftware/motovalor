import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'

const SearchBar = () => {
  const [searchText, setSearchText] = useState('')

  return (
    <View style={ styles.searchView }>
      <View style={ styles.inputView }>
        <TextInput
          defaultValue={ searchText }
          style={ styles.input }
          placeholder='Search'
          textContentType='name'
          onChangeText={ (text) => setSearchText(text) }
          returnKeyType='search'
        />
        { searchText.length === 0 ? (
          <TouchableOpacity>
            <Icon name='search' size={ 24 } color='#333' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={ () => {
              setSearchText('')
            } }
          >
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
