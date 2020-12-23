// import {TreeNode} from '../../gears/tree-view'
export interface Message {
    data?: any
    isFetching?: boolean
    dataTime?: number
    hasShownDataTime?: number
    error?: string
    errTime?: number
    hasShownErrTime?: number
}

const initState: any = {
    
}

const nodeEditorReducer = (state: any = initState, action: any) => {
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
    case 'SHOW_NODE_EDITOR': 
        thisState = Object.assign({}, state, {
            node: action.data,
        })
        break
    default:
        thisState = state
        break
    }
    return thisState
}

export default nodeEditorReducer
