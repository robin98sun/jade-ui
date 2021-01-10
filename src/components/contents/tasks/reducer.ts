export interface Message {
    data?: any
    clearResponse?: any
    isFetching?: boolean
    isClearing?: boolean
    isConfirming?: boolean
    clearTime?: number
    hasShownClearTime?: number
    dataTime?: number
    hasShownDataTime?: number
    error?: string
    errTime?: number
    hasShownErrTime?: number
}

const initState = {
    node: null,
    tasks: null,
}

const reducer = (state: any = initState, action: any) => {
    let tasks: any = null
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.addr||action.data.hostname}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'CLEAR_TASK_CACHE_TO_CONFIRM':
        tasks = Object.assign({}, state.tasks, {
            isClearing: false, 
            isFetching: false,
            isConfirming: true,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_TASK_CACHE_CONFIRMED':
        tasks = Object.assign({}, state.tasks, {
            isClearing: true,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_TASK_CACHE_CANCELED':
        tasks = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_TASK_CACHE_SUCCEEDED':
        tasks = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
            clearResponse: action.data,
            clearTime: Date.now(),
            error: null,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_TASK_CACHE_RESULT_HAS_SHOWN':
        tasks = Object.assign({}, state.tasks, {
            hasShownClearTime: action.data,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_TASK_CACHE_FAILED': 
        tasks = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'FETCH_TASK_CACHE_FAILED':
        tasks = Object.assign({}, state.tasks, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'CLEAR_OR_FETCH_TASK_CACHE_ERROR_HAS_SHOWN': 
        tasks = Object.assign({}, state.tasks, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'FETCH_TASK_CACHE_BEGIN':
        tasks = Object.assign({}, state.tasks, {
            isFetching: true,
            isClearing: false,
            isConfirming: false,
            data: null,
            clearResponse: null,
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'FETCH_TASK_CACHE_SUCCEEDED':
        tasks = Object.assign({}, state.tasks, {
            isFetching: false,
            isClearing: false,
            isConfirming: false,
            data: action.data,
            clearResponse: null,
            error: null,
            dataTime: Date.now(),
        })
        return Object.assign({}, state, {
            tasks,
        })
    case 'FETCH_TASK_CACHE_RESULT_HAS_SHOWN':
        tasks = Object.assign({}, state.tasks, {
            hasShownDataTime: action.data,
        })
        return Object.assign({}, state, {
            tasks,
        })
    default:
        return state
        // break
    }
}


export default reducer