const initState : any = {

}

const headerReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'TITLE':
        return Object.assign({}, state,{
            title: action.data,
        })
        // break
     case 'TOGGLE_DRAWER_MENU':
        return Object.assign({}, state, {
            drawMenuOpen: action.data,
        })
    default:
        return state
        // break
    }
}

export default headerReducer