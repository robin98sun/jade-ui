export interface Message {
    data?: any
    isFetching?: boolean
    error?: string
    errTime?: number
    hasShownErrTime?: number
}

const initState = {
    node: null,
    pods: null,
}

const reducer = (state: any = initState, action: any) => {
    let pods: any = null
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.hostname||action.data.addr}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'FETCH_POD_CACHE_BEGIN':
        pods = Object.assign({}, state.pods, {
            isFetching: true,
            error: null,
        })
        return Object.assign({}, state, {
            pods,
        })
    case 'FETCH_POD_CACHE_SUCCEEDED':
        pods = Object.assign({}, state.pods, {
            isFetching: false,
            data: action.data,
            error: null,
        })
        return Object.assign({}, state, {
            pods,
        })
    case 'FETCH_POD_CACHE_ERROR_HAS_SHOWN':
        pods = Object.assign({}, state.pods, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            pods,
        })
    case 'FETCH_POD_CACHE_FAILED': 
        pods = Object.assign({}, state.pods, {
            isFetching: false,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            pods,
        })
    default:
        return state
        // break
    }
}


export default reducer