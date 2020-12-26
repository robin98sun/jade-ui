// import { combineReducers } from 'redux'
import { TreeNode } from '../../gears/tree-view'

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
    node: null,
    searchResult: null,
    isShowingEditor: false,
    editingNode: null,
}

const searchReducer = (state: any = initState, action: any) => {
    let thisState: any = null
    let searchState: Message|null = null
    switch (action.type) {
    case 'CONNECT_NODE':
        thisState = Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.addr}:${action.data.port}`,
                attributes: action.data,
            }
        })
        break
    case 'SEARCH_FANOUT_BEGIN':
        searchState = Object.assign({}, state.searchResult, {
            isFetching: true,
        })
        thisState = Object.assign({}, state, {
            searchResult: searchState,
        })
        break
    case 'SEARCH_FANOUT_FAILED':
        searchState = Object.assign({}, state.searchResult, {
            isFetching: false,
            errTime: Date.now(),
            error: action.data,
        })
        thisState = Object.assign({}, state, {
            searchResult: searchState,
        })
        break
    case 'SEARCH_FANOUT_ERROR_HAS_SHOWN':
        searchState = Object.assign({}, state.searchResult, {
            hasShownErrTime: action.data,
        })
        thisState = Object.assign({}, state, {
            searchResult: searchState,
        })
        break
    case 'SEARCH_FANOUT_SUCCEEDED':
        searchState = Object.assign({}, state.searchResult, {
            data: action.data,
            isFetching: false,
        })
        thisState = Object.assign({}, state, {
            searchResult: searchState,
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

    return thisState
}

export default searchReducer