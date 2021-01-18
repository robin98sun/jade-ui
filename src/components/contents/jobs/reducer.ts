import { 
    Timer, 
    IterationSettings, 
    Task 
} from '../dispatcher/actions'

export interface Job {
    id: number
    timer: Timer
    iteration: IterationSettings
    task: Task
    isCanceled: boolean
    isFinished: boolean
    count: {
        succeeded: number
        failed: number
        remaining: number
        total: number
    }
}
interface State {
    jobs: {
        [key: number]: Job
    }
}
const initState : State = {
    jobs: {}
}

const reducer = (state: State = initState, action: any) => {
    let newState : any = null
    switch (action.type) {
    case 'DISPATCH_BATCH_JOB_TASK_TRIGGERED':
        const job: Job = {
            id: action.data.task.jobId || action.data.timer.start||0,
            timer: action.data.timer,
            iteration: action.data.timer.iteration,
            task: action.data.task,
            isCanceled: false,
            isFinished: false,
            count: {
                succeeded: 0,
                failed: 0,
                remaining: action.data.timer.iteration.duration * action.data.timer.iteration.arrival_rate - action.data.timer.count,
                total: action.data.timer.iteration.duration * action.data.timer.iteration.arrival_rate,
            }
        }
        const jobItem: any = {}
        jobItem[job.id] = job
        if (state.jobs[job.id]) {
            job.count.succeeded = state.jobs[job.id].count.succeeded
            job.count.failed = state.jobs[job.id].count.failed
        }
        return {
            jobs: Object.assign({}, state.jobs, jobItem)
        }
    case 'DISPATCH_BATCH_JOB_TASK_SUCCEEDED':
        newState = Object.assign({}, state)
        if (newState.jobs[action.data.timer.start||0]) {
            newState.jobs[action.data.timer.start||0].count.succeeded++
            if (newState.jobs[action.data.timer.start||0].count.remaining == 0) {
                newState.jobs[action.data.timer.start||0].isFinished = true
            }
         }
        return newState
    case 'DISPATCH_BATCH_JOB_TASK_FAILED':
        newState = Object.assign({}, state)
        if (newState.jobs[action.data.timer.start||0]) {
            newState.jobs[action.data.timer.start||0].count.failed++
            if (newState.jobs[action.data.timer.start||0].count.remaining == 0) {
                newState.jobs[action.data.timer.start||0].isFinished = true
            }
        }
        return newState
    case 'STOP_BATCH_JOB':
        newState = Object.assign({}, state)
        newState.jobs[action.data].isCanceled = true
        return newState
    default:
        return state
        // break
    }
}

export default reducer