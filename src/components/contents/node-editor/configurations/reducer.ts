// import {TreeNode} from '../../gears/tree-view'
import { Message } from '../reducer'

const initState: any = {
}

const configPageReducer = (state: any = initState, action: any) => {
    let configState: Message|null = null

    let thisState: any = null 

    switch (action.type) {
    case 'FETCH_NODE_CONFIG_BEGIN':
        configState = Object.assign({}, state.config, {
            isFetching: true
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'FETCH_NODE_CONFIG_SUCCEEDED':
        configState = Object.assign({}, state.config, {
            isFetching: false,
            data: action.data,
            dataTime: Date.now(),
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'FETCH_NODE_CONFIG_FAILED':
        configState = Object.assign({}, state.config, {
            isFetching: false,
            error: action.data,
            errTime: Date.now(),
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'FETCH_NODE_CONFIG_ERROR_HAS_SHOWN':
        configState = Object.assign({}, state.config, {
            hasShownErrTime: action.data,
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'UPDATE_NODE_CONFIG_BEGIN':
        configState = Object.assign({}, state.config, {
            isUpdating: true
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'UPDATE_NODE_CONFIG_SUCCEEDED':
        configState = Object.assign({}, state.config, {
            isUpdating: false,
            data: action.data,
            dataTime: Date.now(),
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    case 'UPDATE_NODE_CONFIG_FAILED':
        configState = Object.assign({}, state.config, {
            isUpdating: false,
            error: action.data,
            errTime: Date.now(),
        })
        thisState = Object.assign({}, state, {
            config: configState,
        })
        break
    default:
        thisState = state
        break
    }
    return thisState
}

export default configPageReducer
