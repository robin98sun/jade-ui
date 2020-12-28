import { combineReducers } from 'redux'

import ConfigPageReducer from './configurations/reducer'
import CapabilitiesReducer from './capabilities/reducer'
import CapacitiesReducer from './capacities/reducer'

const subReducerSchema = {
    config: ConfigPageReducer,
    capabilities: CapabilitiesReducer,
    capacities: CapacitiesReducer,
}

const subReducers = combineReducers(subReducerSchema)

// import {TreeNode} from '../../gears/tree-view'
export interface Message {
    data?: any
    isFetching?: boolean
    isUpdating?: boolean
    dataTime?: number
    hasShownDataTime?: number
    error?: string
    errTime?: number
    hasShownErrTime?: number
}

const initState: any = {
    
}

const nodeEditorReducer = (state: any = initState, action: any) => {
    let thisState: any = null 

    switch (action.type) {
    default:
        thisState = state
        break
    }
    // calculate sub reducers
    let tmpState:any = {}
    
    // remove properties of current layer
    for (let prop of Object.keys(subReducerSchema)) {
        if (state[prop] !== undefined) {
            tmpState[prop] = state[prop]
        }
    }

    const subState = subReducers(tmpState, action)
    // return merged state
    return Object.assign({}, thisState, subState)
}

export default nodeEditorReducer
