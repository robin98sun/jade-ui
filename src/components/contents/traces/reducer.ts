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
    traces: null,
    jobs: [],
}

const reducer = (state: any = initState, action: any) => {
    let traces: any = null
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.addr||action.data.hostname}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'CLEAR_TASK_CACHE_TO_CONFIRM':
        traces = Object.assign({}, state.traces, {
            isClearing: false, 
            isFetching: false,
            isConfirming: true,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_TASK_CACHE_CONFIRMED':
        traces = Object.assign({}, state.traces, {
            isClearing: true,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_TASK_CACHE_CANCELED':
        traces = Object.assign({}, state.traces, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: null,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_TASK_CACHE_SUCCEEDED':
        traces = Object.assign({}, state.traces, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
            clearResponse: action.data,
            clearTime: Date.now(),
            error: null,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_TASK_CACHE_RESULT_HAS_SHOWN':
        traces = Object.assign({}, state.traces, {
            hasShownClearTime: action.data,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_TASK_CACHE_FAILED': 
        traces = Object.assign({}, state.traces, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            clearResponse: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'FETCH_TASK_CACHE_FAILED':
        traces = Object.assign({}, state.traces, {
            isClearing: false,
            isFetching: false,
            isConfirming: false,
            data: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'CLEAR_OR_FETCH_TASK_CACHE_ERROR_HAS_SHOWN': 
        traces = Object.assign({}, state.traces, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'FETCH_TASK_CACHE_BEGIN':
        traces = Object.assign({}, state.traces, {
            isFetching: true,
            isClearing: false,
            isConfirming: false,
            data: null,
            clearResponse: null,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'FETCH_TASK_CACHE_SUCCEEDED':
        const taskData: any = action.data
        let onscreenData: any = null
        if (Array.isArray(taskData) && taskData.length && Array.isArray(taskData[0])) {
            onscreenData = taskData.map(line => (line.join(" ")))
        } else {
            onscreenData = taskData
        }

        traces = Object.assign({}, state.traces, {
            isFetching: false,
            isClearing: false,
            isConfirming: false,
            data: onscreenData,
            clearResponse: null,
            error: null,
            dataTime: Date.now(),
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'FETCH_TASK_CACHE_RESULT_HAS_SHOWN':
        traces = Object.assign({}, state.traces, {
            hasShownDataTime: action.data,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'DISPATCH_BATCH_JOB_TASK_TRIGGERED':
        return {
            jobs: Array.prototype.push.call([], ...state.jobs, action.data.task.jobId)
        }
    default:
        return state
        // break
    }
}


export default reducer