import { configureStore } from '@reduxjs/toolkit'
import  fIdReducers  from './reducers/fIdReducers'
export const store = configureStore({
    reducer: {fIdReducers},
})