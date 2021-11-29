import fipeReducer, {
  increment,
  decrement,
  incrementByAmount,
  getInitialState
} from './fipeSlice'
import { FipeState } from './types.d'

describe('counter reducer', () => {
  const initialState: FipeState = { _: 3, isSyncing: false }
  it('should handle initial state', () => {
    expect(fipeReducer(undefined, { type: 'unknown' })).toEqual(getInitialState())
  })

  it('should handle increment', () => {
    const actual = fipeReducer(initialState, increment())
    expect(actual._).toEqual(4)
  })

  it('should handle decrement', () => {
    const actual = fipeReducer(initialState, decrement())
    expect(actual._).toEqual(2)
  })

  it('should handle incrementByAmount', () => {
    const actual = fipeReducer(initialState, incrementByAmount(2))
    expect(actual._).toEqual(5)
  })
})
