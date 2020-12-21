
const initState = {
    addr: '',
    port: 0,
}

const confReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'CONNECT_NODE':
        return Object.assign({}, state, action.data)
    default:
        return state
        // break
    }
}

export default confReducer