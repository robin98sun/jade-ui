
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
    default:
        return state
        // break
    }
}

export default connReducer