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
                name: `${action.data.protocol}://${action.data.addr||action.data.hostname}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'CLEAR_TASK_CACHE_TO_CONFIRM':
        stat = Object.assign({}, state.tasks, {
            isClearing: false, 
            isFetching: false,
            isConfirming: true,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'CLEAR_TASK_CACHE_CONFIRMED':
        stat = Object.assign({}, state.tasks, {
            isClearing: true,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'CLEAR_TASK_CACHE_CANCELED':
        stat = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'CLEAR_TASK_CACHE_FAILED': 
        stat = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'CLEAR_TASK_CACHE_SUCCEEDED':
        stat = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
            clearResponse: action.data,
            clearTime: Date.now(),
            error: null,
        })
        return Object.assign({}, state, {
            stat,
        })    
    case 'CLEAR_OR_FETCH_TASK_CACHE_ERROR_HAS_SHOWN': 
        stat = Object.assign({}, state.tasks, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'CLEAR_TASK_CACHE_RESULT_HAS_SHOWN':
        stat = Object.assign({}, state.tasks, {
            hasShownClearTime: action.data,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'FETCH_STAT_CACHE_BEGIN':
        stat = Object.assign({}, state.stat, {
            isFetching: true,
            error: null,
            isClearing: false,
            isConfirming: false,
            data: null,
            clearResponse: null,
        })
        return Object.assign({}, state, {
            stat,
        })
    case 'FETCH_STAT_CACHE_SUCCEEDED':
        stat = Object.assign({}, state.stat, {
            isFetching: false,
            isClearing: false,
            isConfirming: false,
            data: action.data,
            clearResponse: null,
            error: null,
            dataTime: Date.now(),
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
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
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