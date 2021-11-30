import common, { BORDER_RADIUS as defaultBorderRadius } from './common'
import dark from './dark'
import light from './light'

export default {
  dark: { ...common, ...dark },
  light: { ...common, ...light }
}

export {
  defaultBorderRadius
}
