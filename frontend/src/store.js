import { configureStore } from '@reduxjs/toolkit'
import createRootReducer from "./Reducer";
const store = configureStore({
  reducer:  createRootReducer,

})

export default store