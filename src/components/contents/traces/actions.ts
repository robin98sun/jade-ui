import { TreeNode } from '../../gears/tree-view'
export const clearTaskCache = () => ({
    type: 'CLEAR_TASK_CACHE_TO_CONFIRM',
})

export const clearTaskCacheCanceled = () => ({
    type: 'CLEAR_TASK_CACHE_CANCELED',
})

export const hasShownClearCacheOrFetchCacheError = (errTime: number) => ({
    type: 'CLEAR_OR_FETCH_ERROR_HAS_SHOWN',
    data: errTime,
})

export const hasShownClearCacheResult = (clearTime: number) => ({
    type: 'CLEAR_TASK_CACHE_RESULT_HAS_SHOWN',
    data: clearTime,
})

export const clearTaskCacheConfirmed = (node: TreeNode) => async(dispatch: any) => {
    dispatch({
        type: 'CLEAR_TASK_CACHE_CONFIRMED'
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/taskCacheAndStat`
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
        })

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('invalid response')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'clear task cache failed')
        }
        dispatch({
            type: 'CLEAR_TASK_CACHE_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        dispatch({
            type: 'CLEAR_TASK_CACHE_FAILED',
            data: e.message,
        })
    }
}

export const fetchTraces = (node: TreeNode, jobId: string) => async(dispatch: any) => {
    dispatch({
        type: 'FETCH_TRACE_BEGIN',
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/debug/collectTraces`
        const options:any = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
            body: JSON.stringify({jobId: jobId==='all'?'':jobId}),
        }
        const res = await fetch(url, options)

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('invalid response')
        } else if (typeof msg === 'object' && msg.Error) {
            throw Error(msg.Error)
        }
        dispatch({
            type: 'FETCH_TRACE_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        dispatch({
            type: 'FETCH_TRACE_FAILED',
            data: e.message,
        })
    }
}

export const fetchJobs = (node: TreeNode) => async(dispatch: any) => {
    dispatch({
        type: 'FETCH_JOBS_BEGIN',
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/jobs`
        const options:any = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache'
        }
        const res = await fetch(url, options)

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('invalid response')
        } else if (typeof msg === 'object' && msg.Error) {
            throw Error(msg.Error)
        }
        dispatch({
            type: 'FETCH_JOBS_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        dispatch({
            type: 'FETCH_JOBS_FAILED',
            data: e.message,
        })
    }
}