const initState = {
    currentNode: null,
    topology: null,
    isGettingSubnodes: false,
    hasShownErrTime: 0,
    errTime: 0,
    error: null,
}

const topoReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            currentNode: {
                addr: action.data.addr,
                port: action.data.port,
                token: action.data.token,
                config: action.data.config,
            }
        })
    case 'GET_TOPOLOGY_BEGIN':
        return Object.assign({}, state, {
            isGettingSubnodes: true,
        })
    case 'GET_TOPOLOGY_FAILED':
        return Object.assign({}, state, {
            isGettingSubnodes: false,
            errTime: Date.now(),
            error: action.data,
        })
    case 'GET_TOPOLOGY_ERROR_HAS_SHOWN':
        return Object.assign({}, state, {
            hasShownErrTime: action.data,
        })
    case 'GET_TOPOLOGY_SUCCEEDED':
        return Object.assign({}, state, {
            topology: action.data,
            isGettingSubnodes: false,
        })
    default:
        return state
        // break
    }
}

export default topoReducer