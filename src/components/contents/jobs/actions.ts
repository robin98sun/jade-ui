import { 
    Timer, 
} from '../dispatcher/actions'

export const stopJob = (jobId: number, timer: Timer) => {
    timer.on = false
    if (timer.end <=0 ){
        timer.end = Date.now()
    }
    return ({
        type: 'STOP_BATCH_JOB',
        data: jobId,
    })
}