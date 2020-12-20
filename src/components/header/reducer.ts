const headerReducer = (state: any = {}, action: any) => {
    switch (action.type) {
    case 'TITLE':
        return Object.assign({}, state,{
            title: action.data,
        })
        // break
    default:
        return state
        // break
    }
}

export default headerReducer