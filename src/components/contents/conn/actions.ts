
export const connectNode = (addr:string, port: number, token: string) => async (dispatch: any) => {

    try {
        const res = await fetch(`http://${addr}:${port}/$jade$/debug/configurations`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            // mode: 'no-cors',
            // cache: 'no-cache',
        })

        console.log('res:', res)

        const config = await res.json()
        console.log('config:', config)


    } catch (e) {
        console.log('Error:', e)
    } finally {
        dispatch({
            type: 'CONNECT_NODE',
            data: {
                addr,
                port,
                token,
            }
        })
    }
}