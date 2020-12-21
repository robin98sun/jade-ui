
export const connectNode = (addr:string, port: number, token: string) => async (dispatch: any) => {

    try {
        const res = await fetch(`http://${addr}:${port}/$jade$/debug/configurations`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            // mode: 'no-cors',
            // cache: 'no-cache',
        })

        const config = await res.json()

        dispatch({
            type: 'CONNECT_NODE',
            data: {
                addr,
                port,
                token,
                config,
            }
        })

    } catch (e) {
        console.log('Error:', e)
    } finally {
        
    }
}