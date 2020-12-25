import { TreeNode } from '../../gears/tree-view'
export const fetchNodeConfig = (node: TreeNode|null|undefined) => async (dispatch: any) => {
    dispatch({
        type: 'FETCH_NODE_CONFIG_BEGIN',
        data: node,
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/debug/configurations`
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
            throw Error('invalid response from remote node')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'connection failed')
        }
        dispatch({
            type: 'FETCH_NODE_CONFIG_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        console.error('ERROR when fetching configurations', node, e)
        dispatch({
            type: 'FETCH_NODE_CONFIG_FAILED',
            data: e.message,
        })
    }
}

export const updateNodeConfig = (node: TreeNode|null|undefined, config: any) => async (dispatch: any) => {
    dispatch({
        type: 'UPDATE_NODE_CONFIG_BEGIN',
        data: node,
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/configurations`
        const res = await fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
            mode: 'cors',
            body: JSON.stringify(config),
        })

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('invalid response from remote node')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'connection failed')
        }
        dispatch({
            type: 'UPDATE_NODE_CONFIG_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        console.error('ERROR when fetching configurations', node, e)
        dispatch({
            type: 'UPDATE_NODE_CONFIG_FAILED',
            data: e.message,
        })
    }
}

export const hasShownErrorOfFetchNodeConfig = (errTime: any) =>({
    type: 'FETCH_NODE_CONFIG_ERROR_HAS_SHOWN',
    data: errTime,
})