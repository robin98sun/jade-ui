const initState : any = {
    open: true,
}

const drawerReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'TOGGLE_DRAWER_MENU':
        return Object.assign({}, state,{
            open: action.data,
        })
        // break
    default:
        return state
        // break
    }
}

export default drawerReducer