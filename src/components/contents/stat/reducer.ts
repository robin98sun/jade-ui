export interface Message {
    data?: any
    isFetching?: boolean
    error?: string
    errTime?: number
    hasShownErrTime?: number
}

const initState = {
    node: null,
    stat: null,
}

const reducer = (state: any = initState, action: any) => {
    let stat: any = null
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.hostname||action.data.addr}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'FETCH_STAT_CACHE_BEGIN':
        stat = Object.assign({}, state.stat, {
            isFetching: true,
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'FETCH_STAT_CACHE_SUCCEEDED':
        stat = Object.assign({}, state.stat, {
            isFetching: false,
            data: action.data,
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'FETCH_STAT_CACHE_ERROR_HAS_SHOWN':
        stat = Object.assign({}, state.stat, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'FETCH_STAT_CACHE_FAILED': 
        stat = Object.assign({}, state.stat, {
            isFetching: false,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            stat,
        })
    default:
        return state
        // break
    }
}


export default reducer