const initState = {
    addr: '',
    port: 0,
}

const connReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            addr: action.data.addr,
            port: action.data.port,
            token: action.data.token,
        })
    case 'CONNECT_NODE_ERROR':
        return Object.assign({}, state, {
            addr: action.data.addr,
            port: action.data.port,
            token: action.data.token,
            error: action.data.error,
            errTime: action.data.errTime,
        })
    case 'CONNECT_NODE_ERROR_HAS_SHOWN':
        return Object.assign({}, state, {
            hasShownErrTime: action.data,
        })
    default:
        return state
        // break
    }
}

export default connReducer