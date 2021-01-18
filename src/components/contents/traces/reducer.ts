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
    case 'FETCH_TRACE_FAILED': case 'FETCH_JOBS_FAILED':
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
    case 'CLEAR_OR_FETCH_ERROR_HAS_SHOWN': 
        traces = Object.assign({}, state.traces, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            traces,
        })
    case 'FETCH_TRACE_BEGIN': case 'FETCH_JOBS_BEGIN':
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
    case 'FETCH_TRACE_SUCCEEDED': case 'FETCH_JOBS_SUCCEEDED':
        const taskData: any = action.data
        let onscreenData: any = null
        let fetchedJobs: string[] = []
        if (action.type === 'FETCH_TRACE_SUCCEEDED') {
            if (Array.isArray(taskData) && taskData.length && Array.isArray(taskData[0])) {
                onscreenData = taskData.map(line => (line.join(" ")))
            } else {
                onscreenData = taskData
            }
            fetchedJobs = state.jobs && state.jobs.length ? state.jobs:[]
        } else if (action.type === 'FETCH_JOBS_SUCCEEDED') {
            onscreenData = state.traces ? state.traces.data : null
            fetchedJobs = action.data.sort()
        }
        
        traces = Object.assign({}, state.traces, {
            isFetching: false,
            isClearing: false,
            isConfirming: false,
            data: onscreenData,
            clearResponse: null,
            error: null,
            dataTime: action.type === 'FETCH_TRACE_SUCCEEDED' 
                ? Date.now()
                : state.traces 
                ? state.traces.dataTime
                : undefined,
        })
        return Object.assign({}, state, {
            traces,
            jobs: fetchedJobs,
        })
    case 'FETCH_TRACE_RESULT_HAS_SHOWN':
        traces = Object.assign({}, state.traces, {
            hasShownDataTime: action.data,
        })
        return Object.assign({}, state, {
            traces,
        })
    // case 'DISPATCH_BATCH_JOB_TASK_TRIGGERED':
    //     let jobs: string[] = []
    //     if (state.jobs && Array.isArray(state.jobs) && state.jobs.length) {
    //         jobs = state.jobs
    //     }
    //     if (jobs.indexOf(action.data.task.jobId)<0) {
    //         jobs.push(action.data.task.jobId)
    //         jobs.sort()
    //     }
    //     return Object.assign({}, state, {
    //         jobs: jobs,
    //     })
    default:
        return state
        // break
    }
}


export default reducer