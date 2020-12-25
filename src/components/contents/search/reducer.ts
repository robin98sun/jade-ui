// import { combineReducers } from 'redux'

// import {nodeEditorReducer} from './node-dialog/reducer'


// const subReducerSchema = {
//     editor: nodeEditorReducer,
// }
// const subReducers = combineReducers(subReducerSchema)

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

const initState = {
    currentNode: null,
    topology: null,
    isShowingEditor: false,
    editingNode: null,
}

const topoReducer = (state: any = initState, action: any) => {
    let thisState: any = null
    let topoState: Message|null = null
    switch (action.type) {
    case 'CONNECT_NODE':
        thisState = Object.assign({}, state, {
            currentNode: {
                addr: action.data.addr,
                port: action.data.port,
                token: action.data.token,
                protocol: action.data.protocol,
            }
        })
        break
    case 'GET_TOPOLOGY_BEGIN':
        topoState = Object.assign({}, state.topology, {
            isFetching: true,
        })
        thisState = Object.assign({}, state, {
            topology: topoState,
        })
        break
    case 'GET_TOPOLOGY_FAILED':
        topoState = Object.assign({}, state.topology, {
            isFetching: false,
            errTime: Date.now(),
            error: action.data,
        })
        thisState = Object.assign({}, state, {
            topology: topoState,
        })
        break
    case 'GET_TOPOLOGY_ERROR_HAS_SHOWN':
        topoState = Object.assign({}, state.topology, {
            hasShownErrTime: action.data,
        })
        thisState = Object.assign({}, state, {
            topology: topoState,
        })
        break
    case 'GET_TOPOLOGY_SUCCEEDED':
        topoState = Object.assign({}, state.topology, {
            data: action.data,
            isFetching: false,
        })
        thisState = Object.assign({}, state, {
            topology: topoState,
        })
        break
    case 'SHOW_NODE_EDITOR': 
        thisState = Object.assign({}, state, {
            isShowingEditor: true,
            editingNode: action.data,
        })
        break
    case 'CLOSE_NODE_EDITOR':
        thisState = Object.assign({}, state, {
            isShowingEditor: false,
            editingNode: undefined,
        })
        break
    default:
        thisState = state
        break
    }
    // calculate sub reducers
    // let tmpState:any = {}
    
    // remove properties of current layer
    // for (let prop of Object.keys(subReducerSchema)) {
    //     if (state[prop] !== undefined) {
    //         tmpState[prop] = state[prop]
    //     }
    // }

    // const subState = subReducers(tmpState, action)
    // return merged state
    // return Object.assign({}, thisState, subState)

    return thisState
}

export default topoReducer