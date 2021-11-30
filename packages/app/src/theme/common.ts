import { Theme } from 'react-native-elements'

export const BORDER_RADIUS = 5

const common: Theme = {
  Button: {
    buttonStyle: {
      borderRadius: BORDER_RADIUS
    }
  },
  SearchBar: {
    inputContainerStyle: {
      borderRadius: 50
    }
  },
  Icon: {
    size: 24
  },
  ButtonGroup: {
    containerStyle: {
      borderRadius: BORDER_RADIUS
    }
  },
  ListItemContent: {
    style: {
      borderRadius: BORDER_RADIUS
    }
  }
}

export default common
