import { TreeNode } from '../../gears/tree-view'

const pageName = 'conf'

const initState = {
    currentNode: {
        name:'',
        attributes: null,
    },
    drawMenuOpen: true,
    isFocusing: false,
}

const confReducer = (state: any = initState, action: any) => {
    switch (action.type) {
    case 'SWITCH_CONTENT':
        return Object.assign({}, state, {
            isFocusing: action.data === pageName,
        })
    case 'CONNECT_NODE':
        const currentNode: TreeNode = {}
        currentNode.name = (action.data.addr && action.data.port && action.data.protocol) 
                            ? `${action.data.protocol}://${action.data.addr}:${action.data.port}`
                            : undefined
        currentNode.attributes = action.data
        return Object.assign({}, state, {
            currentNode,
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