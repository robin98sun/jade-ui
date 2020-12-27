
export const dispatchTask = (node: any, application: any, budget: any, options: any, aggregator: any, worker: any, searchCriteria: any) => async(dispatch: any) => {
    dispatch({
        type: 'DISPATCH_TASK_BEGIN',
    })

    console.log('dispatching:', node, application, budget, options, aggregator, worker, searchCriteria)

    const task: any = {

    }
    const fakeResult = async()=>{
        return new Promise((res, rej) => {
            setTimeout(()=>{
                dispatch({
                    type: 'DISPATCH_TASK_FAILED',
                    data: 'NOT FINISHED',
                })
                res()
            }, 500)  
        })
    }
    await fakeResult()
    // try {
    //     const baseUrl = node && node.name ? node.name : ''
    //     const url = `${baseUrl}/$jade$/taskReceiver`
    //     const res = await fetch(url, {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         cache: 'no-cache',
    //         body: JSON.stringify({
    //             collective: collectiveCriteria,
    //             exclusive: exclusiveCriteria,
    //         })
    //     })

    //     if (res.status !== 200 ) {
    //         throw Error(`${res.status}: ${res.statusText}`)
    //     }

    //     const msg = await res.json()

    //     if (!msg) {
    //         throw Error('no match')
    //     } else if (typeof msg !== 'object' || msg.Error) {
    //         throw Error(msg.Error || msg || 'search fanout failed')
    //     }
    //     const searchResult = {
    //             name: 'search results',
    //             unfolded: true,
    //             subnodes: msg.map((item: string)=>({
    //                 name: item,
    //                 attributes: {}
    //             })),
    //         }
    //     dispatch({
    //         type: 'DISPATCH_TASK_SUCCEEDED',
    //         data: searchResult,
    //     })
    // } catch (e) {
    //     console.error('ERROR when searching fanout:', node, e)
    //     dispatch({
    //         type: 'DISPATCH_TASK_FAILED',
    //         data: e.message,
    //     })
    // }
}

export const dismissErrMsg = (errTime: number) => ({
    type: 'DISPATCH_TASK_ERROR_HAS_SHOWN',
    data: errTime,
})