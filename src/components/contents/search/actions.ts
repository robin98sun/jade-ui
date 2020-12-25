import { TreeNode } from '../../gears/tree-view'


export const hasShownErrorOfSearchFanout = (errTime: any) =>({
    type: 'SEARCH_FANOUT_ERROR_HAS_SHOWN',
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
