
export const connectedWithServer = (config: any) => async(dispatch: any) => {
    if (config && config.selfNode) {
        dispatch({
            type: 'CONNECT_NODE',
            data: {
                addr: config.selfNode.address,
                port: config.selfNode.port,
                token: config.selfNode.token,
                protocol: config.selfNode.protocol,
                hostname: config.selfNode.hostname,
                config: config,
                trigger: 'conf',
            }
        })  
    }
    
}