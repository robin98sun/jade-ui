
const initState = {
}

const confReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, {
            addr: action.data.addr,
            port: action.data.port,
            config: action.data.config,
        })
    case 'TOGGLE_DRAWER_MENU': 
        return Object.assign({}, state, {
            drawMenuOpen: action.data,
        }) 
    default:
        return state
        // break
    }
}

export default confReducer