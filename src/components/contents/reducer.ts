import { combineReducers } from 'redux'

import IntroReducer from './intro/reducer'
import ConnReducer from './conn/reducer'
import ConfReducer from './conf/reducer'
import TopoReducer from './topo/reducer'

import { defaultItem } from '../content.items'

const subReducers = combineReducers({
    intro: IntroReducer,
    conn: ConnReducer,
    conf: ConfReducer,
    topo: TopoReducer,
})

const initState : any = {
    contentName: defaultItem,
}


const contentReducer = (state: any = initState, action: any) => {
    let contentState: any = null
    switch (action.type) {
    case 'SWITCH_CONTENT':
        contentState = Object.assign({}, state, {
            contentName: action.data,
        })
        break
    default:
        contentState = state
        break
    }

    // calculate sub reducers
    const tmpState = Object.assign({}, state)
    
    // remove properties of current layer
    for (let prop of Object.keys(initState)) {
        if (tmpState[prop] !== undefined) {
            delete(tmpState[prop])
        }
    }

    const subState = subReducers(tmpState, action)
    // return merged state
    return Object.assign({}, contentState, subState)
    // return contentState
}

export default contentReducer
