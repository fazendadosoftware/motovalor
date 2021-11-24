import React from 'react'
import { Text, TouchableOpacity, StyleSheet, ViewStyle, Appearance } from 'react-native'
import { useTheme } from 'react-native-elements'

const Button: React.FC<{
  label: string,
  model: boolean,
  onPress: () => void, disabled?: boolean,
  containerStyle?: ViewStyle
}> = ({ label, model, onPress, disabled, containerStyle = {} }) => {
  const { theme } = useTheme()
  const isDark = Appearance.getColorScheme() === 'dark'

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, { backgroundColor: model ? theme.colors?.primary : 'white', borderColor: theme.colors?.primary, ...containerStyle }]}
      onPress={() => onPress()} >
      <Text style={{ color: model ? 'white' : isDark ? 'white' : theme.colors?.primary, fontWeight: '500', fontSize: 16 }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10
  }
})

export default Button
