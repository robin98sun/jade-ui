import { TreeNode } from '../../gears/tree-view'


export const hasShownErrorOfSearchFanout = (errTime: any) =>({
    type: 'SEARCH_FANOUT_ERROR_HAS_SHOWN',
    data: errTime,
})

export const closeSearchResult = () => ({
    type: 'CLOSE_SEARCH_RESULT',
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
        const searchResult = {
                name: 'search results',
                unfolded: true,
                subnodes: msg.map((item: string)=>({
                    name: item,
                    attributes: {}
                })),
            }
        dispatch({
            type: 'SEARCH_FANOUT_SUCCEEDED',
            data: searchResult,
        })
        dispatch({
            type: 'GET_TOPOLOGY_SUCCEEDED',
            data: searchResult,
        })
    } catch (e) {
        console.error('ERROR when searching fanout:', node, e)
        dispatch({
            type: 'SEARCH_FANOUT_FAILED',
            data: e.message,
        })
    }
}