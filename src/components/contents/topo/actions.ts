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
    let count = 0
    for (let nodeName of Object.keys(msg)) {
        if (!root.subnodes) {
            root.subnodes = {}
        }
        const node = msg[nodeName]
        try{
            root.subnodes[nodeName] = await fetchNode(node.protocol, node.address, node.port, node.token) 
            console.log("successfully accessed ["+count+"] "+nodeName)
        }catch(e) {
            console.log("ERROR when fetching subnode for "+nodeName)
            // throw e
        }
        count++
        
    }
    return root
}

export const getTopology = (protocol: string, addr: string, port: number, token: string) => async (dispatch:any) => {
    try {
        dispatch({
            type: 'GET_TOPOLOGY_BEGIN',
        })
        const root = await fetchNode(protocol, addr, port, token)
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


export const showNodeEditor = (node: TreeNode) => async (dispatch: any) => {
    dispatch({
        type: 'SHOW_NODE_EDITOR',
        data: node,
    })
}

export const closeNodeEditor = () => ({
    type: 'CLOSE_NODE_EDITOR',
})
