import { switchContent } from '../../drawer-menu/actions'

export const connectNode = (addr:string, port: number, token: string, targetPage: string, slientFaile: boolean) => async (dispatch: any) => {

    const protocol = 'http'
    dispatch({
        type: 'CONNECT_NODE_BEGIN',
    })
    try {
        let url = `${protocol}://${addr}:${port}/$jade$/debug/configurations`
        if (!addr || !port) {
            url = '/$jade$/debug/configurations'
        }
        const res = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            cache: 'no-cache',
        })

        if (res.status !== 200 ) {
            throw Error(`${res.status}: ${res.statusText}`)
        }

        const msg = await res.json()

        if (!msg) {
            throw Error('invalid response from remote node')
        } else if (typeof msg !== 'object' || msg.Error) {
            throw Error(msg.Error || msg || 'connection failed')
        }
        dispatch({
            type: 'CONNECT_NODE',
            data: {
                addr,
                port,
                token,
                protocol,
                config: msg,
            }
        })
        if (targetPage) {
            dispatch(switchContent(targetPage))
        }
    } catch (e) {
        console.error(`Error when connecting to [http:${addr}:${port}] using token [${token}]:`, e)
        if (!slientFaile) {
            dispatch({
                type: 'CONNECT_NODE_ERROR',
                data: {
                    addr,
                    port,
                    token,
                    protocol,
                    error: e.message,
                    errTime: Date.now(),
                }
            })
        } else {
            dispatch({
                type: 'CONNECT_NODE_END',
            })
        }
    }
}

export const hasShownError = (errTime: any) => ({
    type: 'CONNECT_NODE_ERROR_HAS_SHOWN',
    data: errTime,
})