
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
   dispatchResult: {
       isFetching: false,
       isUpdating: false,
   },
   node: null
}

const dispatcherReducer = (state: any = initState, action: any) => {
    let dispatchResult: any = null
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            node: {
                name: `${action.data.protocol}://${action.data.addr||action.data.hostname}:${action.data.port}`,
                attributes: action.data,
            }
        })
    case 'DISPATCH_TASK_TO_CONFIRM':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            isUpdating: false, 
            isFetching: true,
            data: action.data,
            error: null,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_CONFIRMED':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            isUpdating: true,
            isFetching: false,
            data: null,
            error: null,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_CANCELED': case 'DISPATCH_BATCH_JOB_CONFIRMED':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            isUpdating: false,
            isFetching: false,
            data: null,
            error: null,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_SUCCEEDED':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            isUpdating: false,
            isFetching: false,
            data: action.data,
            dataTime: Date.now(),
            error: null,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_RESULT_HAS_SHOWN':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            hasShownDataTime: action.data,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_FAILED':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            isUpdating: false,
            isFetching: false,
            data: null,
            error: action.data,
            errTime: Date.now(),
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    case 'DISPATCH_TASK_ERROR_HAS_SHOWN':
        dispatchResult = Object.assign({}, state.dispatchResult, {
            hasShownErrTime: action.data,
        })
        return Object.assign({}, state, {
            dispatchResult,
        })
    default:
        return state
        // break
    }
}

export default dispatcherReducer