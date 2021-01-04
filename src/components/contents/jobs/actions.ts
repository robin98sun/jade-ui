import { 
    Timer, 
} from '../dispatcher/actions'

export const stopJob = (jobId: number, timer: Timer) => {
    timer.on = false
    return ({
        type: 'STOP_BATCH_JOB',
        data: jobId,
    })
}