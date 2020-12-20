
import { combineReducers } from 'redux'
import AppReducer from './components/App.reducer'

export const RootReducer = combineReducers({
    app: AppReducer,
})

