import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from './reducers/counter/counterSlice'
import fipeReducer from './reducers/fipe/fipeSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    fipe: fipeReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
