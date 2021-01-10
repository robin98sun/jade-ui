import { TreeNode } from '../../gears/tree-view'
import { switchContent } from '../../drawer-menu/actions'
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

export interface IterationSettings {
  iteration_mode: 'Constant speed'|'Possion process',
  arrival_rate: number,
  duration: number,
  time_unit: 'second'|'minute',
}

export const dispatchTask = (
                node: any, 
                task: Task, 
              ) => async(dispatch: any) => {
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
    if (task.options && task.options.estimatedServiceTimeModel) {
        taskInst.payload[0].options = {
            estimatedServiceTimeModel: task.options.serviceTimeDistribution,
            estimatedMeanServiceTime: task.options.serviceTime,
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

export interface Timer { 
    on: boolean, 
    instance: any, 
    count: number, 
    start: number,
    iteration: IterationSettings,
}

const dispatchTaskInst = async (
        node: TreeNode, 
        taskInst: any, 
        dispatch: any,
        actionName: string,
        timer?: Timer,
      ) => {
    try {
        dispatch({
            type: `${actionName}_${actionName==='DISPATCH_TASK'?'CONFIRMED':'TRIGGERED'}`,
            data: timer
                  ? {
                        timer,
                        task: taskInst,
                    }
                  : taskInst,
        })
        // if (timer) return 

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
            type: `${actionName}_SUCCEEDED`,
            data: timer
                  ? {
                        timer,
                        res: msg,
                    }
                  : taskInst,
        })
    } catch (e) {
        console.error('ERROR when dispatching task:', node, e)
        dispatch({
            type: `${actionName}_FAILED`,
            data: timer
                  ? {
                        timer,
                        error: e.message,
                    }
                  : taskInst,
        })
    }
}

export const confirmDispatching=(
                node: TreeNode, 
                taskInst: any,
                iteration?: IterationSettings,
             )=>async(dispatch:any)=> {

    if (iteration) {
        dispatch({
            type: 'DISPATCH_BATCH_JOB_CONFIRMED',
        })
        dispatch(switchContent('jobStatus'))
        const timer: Timer = {
            on: true,
            instance: null,
            count: 0,
            start: Date.now(),
            iteration: iteration,
        }
        if (iteration.iteration_mode === 'Constant speed') {
            let interval: number = 0
            if (iteration.time_unit === 'second') {
                interval = Math.round(1000 / iteration.arrival_rate)
            } else if (iteration.time_unit === 'minute') {
                interval = Math.round(1000 * 60 / iteration.arrival_rate)
            }
            timer.instance = setInterval(async ()=>{
                if (timer.on) {
                    if (timer.count < iteration.arrival_rate*iteration.duration) {
                        timer.count++
                        await dispatchTaskInst(node, taskInst, dispatch, 'DISPATCH_BATCH_JOB_TASK', timer)
                    } else {
                        timer.on = false
                        if (timer.instance) {
                            clearInterval(timer.instance)
                        }
                    }
                } else if(timer.instance) {
                    clearInterval(timer.instance)
                }
            }, interval)
        } else if (iteration.iteration_mode === 'Possion process') {
            const nextTime = (unitDuration: number, rate: number): number => {
                return Math.round(-Math.log(1-Math.random()) / rate * unitDuration)
            }
            const duration = iteration.time_unit === 'second' ? 1000 : 60000
            const roundRoutine = () => {
                timer.instance = setTimeout(async()=> {
                    if (timer.on) {
                        if (timer.count < iteration.arrival_rate*iteration.duration) {
                            timer.count++
                            await dispatchTaskInst(node, taskInst, dispatch, 'DISPATCH_BATCH_JOB_TASK', timer)
                            roundRoutine()
                        } else {
                            timer.on = false
                            if (timer.instance) {
                                clearTimeout(timer.instance)
                            }
                        }
                    } else if(timer.instance) {
                        clearTimeout(timer.instance)
                    }
                }, nextTime(duration, iteration.arrival_rate))
            }
            roundRoutine()
        }

    } else {
        await dispatchTaskInst(node, taskInst, dispatch, 'DISPATCH_TASK')
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