import { combineReducers } from 'redux'

// Reducer for App component
import HeaderReducer from './header/reducer'
import DrawerReducer from './drawer-menu/reducer'
import ContentReducer from './contents/reducer'

import { defaultItem } from './content.items'

const subReducerSchema = {
    header: HeaderReducer,
    drawer: DrawerReducer,
    content: ContentReducer,
}
const subReducers = combineReducers(subReducerSchema)

const initState : any = {
    drawMenuOpen: true,
    contentName: defaultItem,
}


const appReducer = (state: any = initState, action: any) => {
    let appState: any = null
    switch (action.type) {
    case 'TOGGLE_DRAWER_MENU':
        appState = Object.assign({}, state, {
            drawMenuOpen: action.data,
        })
        break
    case 'SWITCH_CONTENT':
        appState = Object.assign({}, state, {
            contentName: action.data,
        })
        break
    default:
        appState = state
        break
    }

    // calculate sub reducers
    const tmpState :any= {}
    
    // remove properties of current layer
    for (let prop of Object.keys(subReducerSchema)) {
        if (state[prop] !== undefined) {
            tmpState[prop]=state[prop]
        }
    }

    const subState = subReducers(tmpState, action)
    // return merged state
    return Object.assign({}, appState, subState)
}

export default appReducer
