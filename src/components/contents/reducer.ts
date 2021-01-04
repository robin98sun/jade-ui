import { combineReducers } from 'redux'

import IntroReducer from './intro/reducer'
import ConnReducer from './conn/reducer'
import ConfReducer from './conf/reducer'
import TopoReducer from './topo/reducer'
import DispatcherReducer from './dispatcher/reducer'
import NodeEditorReducer from './node-editor/reducer'
import SearchReducer from './search/reducer'
import ExampleReducer from './dispatcher/reducer'
import TasksReducer from './tasks/reducer'
import PodsReducer from './pods/reducer'
import StatReducer from './stat/reducer'
import JobsReducer from './jobs/reducer'

import { defaultItem } from '../content.items'

const subReducers = combineReducers({
    intro: IntroReducer,
    conn: ConnReducer,
    conf: ConfReducer,
    topo: TopoReducer,
    dispatcher: DispatcherReducer,
    editor: NodeEditorReducer,
    search: SearchReducer,
    example: ExampleReducer,
    tasks: TasksReducer,
    pods: PodsReducer,
    stat: StatReducer,
    jobs: JobsReducer,
})

const initState : any = {
    contentName: defaultItem,
}


const contentReducer = (state: any = initState, action: any) => {
    let contentState: any = null
    switch (action.type) {
    case 'SWITCH_CONTENT':
        contentState = Object.assign({}, state, {
            contentName: action.data,
        })
        break
    default:
        contentState = state
        break
    }

    // calculate sub reducers
    const tmpState = Object.assign({}, state)
    
    // remove properties of current layer
    for (let prop of Object.keys(initState)) {
        if (tmpState[prop] !== undefined) {
            delete(tmpState[prop])
        }
    }

    const subState = subReducers(tmpState, action)
    // return merged state
    return Object.assign({}, contentState, subState)
    // return contentState
}

export default contentReducer
