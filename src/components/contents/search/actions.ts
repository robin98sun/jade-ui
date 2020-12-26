import { TreeNode } from '../../gears/tree-view'


export const hasShownErrorOfSearchFanout = (errTime: any) =>({
    type: 'SEARCH_FANOUT_ERROR_HAS_SHOWN',
    data: errTime,
})


export const showNodeEditor = (node: TreeNode) => async (dispatch: any) => {
    dispatch({
        type: 'SHOW_NODE_EDITOR',
        data: node,
    })
}

export const closeNodeEditor = () => ({
    type: 'CLOSE_NODE_EDITOR',
})

export const searchFanout = (node: TreeNode|undefined, collectiveCriteria: any, exclusiveCriteria: any) => async(dispatch: any) => {
    dispatch({
        type: 'SEARCH_FANOUT_BEGIN',
        data: node,
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/debug/searchNodes`
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
            body: JSON.stringify({
                collective: collectiveCriteria,
                exclusive: exclusiveCriteria,
            })
        })

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('no match')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'search fanout failed')
        }
        dispatch({
            type: 'SEARCH_FANOUT_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        console.error('ERROR when searching fanout:', node, e)
        dispatch({
            type: 'SEARCH_FANOUT_FAILED',
            data: e.message,
        })
    }
}