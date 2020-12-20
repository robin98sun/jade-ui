import { combineReducers } from 'redux'

// Reducer for App component
import HeaderReducer from './header/reducer'
import DrawerReducer from './drawer-menu/reducer'
import ContentReducer from './contents/reducer'

import { defaultItem } from './content.items'

const subReducers = combineReducers({
    header: HeaderReducer,
    drawer: DrawerReducer,
    content: ContentReducer,
})

const initState : any = {
    drawMenuOpen: true,
    contentName: defaultItem,
}


const appReducer = (state: any = initState, action: any) => {
    let appState: any = null
    switch (action.type) {
    case 'TOGGLE_DRAWER_MENU':
        appState = Object.assign({}, state, {
            drawMenuOpen: !state.drawMenuOpen,
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
    const tmpState = Object.assign({},state)
    
    // remove properties of current layer
    for (let prop of Object.keys(initState)) {
        if (tmpState[prop] !== undefined) {
            delete(tmpState[prop])
        }
    }

    const subState = subReducers(tmpState, action)
    // return merged state
    return Object.assign({}, appState, subState)
}

export default appReducer
