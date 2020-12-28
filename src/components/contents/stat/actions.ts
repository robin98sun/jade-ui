import { TreeNode } from '../../gears/tree-view'

export const hasShownFetchStatsError = (errTime: number) => ({
    type: 'FETCH_STAT_CACHE_ERROR_HAS_SHOWN',
    data: errTime,
})

export const fetchStatCache = (node: TreeNode) => async(dispatch: any) => {
    dispatch({
        type: 'FETCH_STAT_CACHE_BEGIN',
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/dumpStat`
        const res = await fetch(url, {
            method: 'GET',
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
            throw Error(msg.Error || msg || 'fetch task cache failed')
        }
        dispatch({
            type: 'FETCH_STAT_CACHE_SUCCEEDED',
            data: msg.payload,
        })
    } catch (e) {
        dispatch({
            type: 'FETCH_STAT_CACHE_FAILED',
            data: e.message,
        })
    }

}