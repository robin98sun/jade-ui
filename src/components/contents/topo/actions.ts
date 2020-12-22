import { TreeNode } from '../../gears/tree-view'

const fetchNode = async (protocol: string, addr: string, port: number, token: string) => {
    const baseUrl = addr && port ? `${protocol}://${addr}:${port}`: ''
    let url = `${baseUrl}/$jade$/debug/subnodes`

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

    const root : TreeNode = {
        name: baseUrl ? baseUrl : window.location.href,
        attributes: {
            address: addr ? addr : window.location.hostname, 
            port: port ? port : window.location.port, 
            protocol,
            token,
        },
        unfolded: true,
    }
    for (let nodeName of Object.keys(msg)) {
        if (!root.subnodes) {
            root.subnodes = {}
        }
        const node = msg[nodeName]
        root.subnodes[nodeName] = await fetchNode(node.protocol, node.address, node.port, node.token)
    }
    return root
}

export const getTopology = (addr: string, port: number, token: string) => async (dispatch:any) => {
    try {
        dispatch({
            type: 'GET_TOPOLOGY_BEGIN',
        })
        const root = await fetchNode('http', addr, port, token)
        dispatch({
            type: 'GET_TOPOLOGY_SUCCEEDED',
            data: root
        })
    } catch (e) {
        console.error(`ERROR when getting subnodes from [$addr:$port] using token [$token]:`, e.message)
        dispatch({
            type: 'GET_TOPOLOGY_FAILED',
            data: e.message,
        })
    }
}

export const hasShownErrorOfGetTopology = (errTime: any) =>({
    type: 'GET_TOPOLOGY_ERROR_HAS_SHOWN',
    data: errTime,
})


export const showEditorForNode = (node: TreeNode) => async (dispatch: any) => {
    dispatch({
        type: 'SHOW_NODE_EDITOR',
        data: node,
    })
}

export const fetchNodeConfig = (node: TreeNode) => async (dispatch: any) => {
    dispatch({
        type: 'FETCH_NODE_CONFIG_BEGIN',
        data: node,
    })

    try {
        const baseUrl = node.name
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
        console.error('ERROR when fetching node', node.name, e)
        dispatch({
            type: 'FETCH_NODE_CONFIG_FAILED',
            data: e.message,
        })
    }
}