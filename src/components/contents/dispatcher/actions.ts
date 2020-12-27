import { TreeNode } from '../../gears/tree-view'
export interface Task {
        application: any, 
        budget: any, 
        options: any, 
        aggregator: any, 
        worker: any, 
        fanout: {
            collective: any,
            exclusive: any
        }, 
        resources: {
          aggregator: any, 
          worker: any,
        }
      }

export const dispatchTask = (node: any, task: Task) => async(dispatch: any) => {
    if (!node || !node.attributes || !node.attributes.token 
        ||!task || !task.application || !task.budget 
        || !task.aggregator || !task.worker || !task.fanout
        || !task.resources || !task.resources.aggregator 
        || !task.resources.worker
    ) {
        dispatch({
            type: 'DISPATCH_TASK_FAILED',
            data: 'invalid task, some part(s) is missing',
        })
        return
    }

    dispatch({
        type: 'DISPATCH_TASK_BEGIN',
    })

    let budget :any= Object.assign({}, task.budget)
    if (budget.fanoutTable && budget.fanoutTable.length) {
        budget = JSON.parse(JSON.stringify(task.budget))
        budget.fanoutTable.unshift(0)
    }
    const taskInst: any = {
        token: node!.attributes!.token,
        payload: [{
            task: {
                forceUpdateNetworkStructure: task!.options?task!.options!.updateNetwork||false:false,
                queuingMechanism: task!.options?task!.options!.queuing||'ddl':'ddl',
                application: {
                    envName: "jadelet",
                    name: task!.application!.name,
                    version: task!.application!.version,
                    owner: task!.application!.owner,
                    modules: {
                        aggregator: Object.assign({
                            port: 8080,
                            protocol: 'TCP',
                            input: {}, 
                        }, task!.aggregator),
                        worker: Object.assign({
                            port: 8080,
                            protocol: 'TCP',
                            input: {},
                        },task!.worker),
                    }
                },
                requirements: {
                    collective: task!.fanout!.collective,
                    exclusive: task!.fanout!.exclusive,
                    allocations: {
                        worker: {
                            minimumCapacity: Object.assign({}, task!.resources!.worker),
                            maximumCapacity: Object.assign({}, task!.resources!.worker),
                        },
                        aggregator: {
                            minimumCapacity: Object.assign({},task!.resources!.aggregator),
                            maximumCapacity: Object.assign({},task!.resources!.aggregator),
                        },
                    }
                }
            },
            reportTo: {},
            budgets: {
                worker: budget,
            }
        }]
    }
    for (let type of ['worker', 'aggregator']) {
        const targetObject = taskInst.payload[0].task.requirements.allocations[type].maximumCapacity
        for (let key of Object.keys(targetObject)) {
            if (Number.isInteger(targetObject[key])) {
                targetObject[key] = 1*targetObject[key]
            }
        }
    }
    dispatch({
        type: 'DISPATCH_TASK_TO_CONFIRM',
        data: taskInst,
    })
}

export const cancelDispatching=()=>({
    type: 'DISPATCH_TASK_CANCELED',
})

export const confirmDispatching=(node: TreeNode, taskInst: any)=>async(dispatch:any)=> {

    dispatch({
        type: 'DISPATCH_TASK_CONFIRMED',
        data: taskInst,
    })

    try {
        const baseUrl = node && node.name ? node.name : ''
        const url = `${baseUrl}/$jade$/taskReceiver`
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
            body: JSON.stringify(taskInst)
        })

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('no match')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'search fanout failed')
        }
        dispatch({
            type: 'DISPATCH_TASK_SUCCEEDED',
            data: msg,
        })
    } catch (e) {
        console.error('ERROR when searching fanout:', node, e)
        dispatch({
            type: 'DISPATCH_TASK_FAILED',
            data: e.message,
        })
    }
}

export const dismissErrMsg = (errTime: number) => ({
    type: 'DISPATCH_TASK_ERROR_HAS_SHOWN',
    data: errTime,
})


export const dismissDispatchingResult = (dataTime: number) => ({
    type: 'DISPATCH_TASK_RESULT_HAS_SHOWN',
    data: dataTime,
})