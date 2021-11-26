import { SearchBar } from 'react-native-elements'
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar'

// https://githubmemory.com/repo/react-native-elements/react-native-elements/issues/3089
const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>

export default SafeSearchBar
