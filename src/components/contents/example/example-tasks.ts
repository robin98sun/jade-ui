import { Task } from '../dispatcher/actions'

export const plankton = (type: string, version: string) => {
    const taskSimple: Task = {
        application: {
            name: 'sample',
            version: version,
            owner: 'aces.uta.edu',
        }, 
        budget: {
            fanoutTable:[0,100, 300, 600, 1200, 1800, 2400, 3600]
        }, 
        options: {
            updateNetwork: false,
            queuing: 'ddl',
        }, 
        aggregator: {
            image: `robin98/plankton:${version}-amd64`,
            port: 8080,
            input: {},
        }, 
        worker: {
            image: `robin98/plankton:${version}-arm32`,
            port: 8080,
            input: {
                "cmd": "gen and merge",
                "size": 100
            }
        },
        fanout: {
            collective: [
                {
                    "name": "location",
                    "value": "NYC"
                },
                {
                    "name": "location",
                    "value": "DAL"
                },
                {
                    "name": "location",
                    "value": "LA"
                }
            ],
            exclusive: [
                {
                    "name": "accuracy",
                    "value": "city"
                },
                {
                    "name": "avg_temperature"
                }
            ]
        }, 
        resources: {
            aggregator: {
                "cpu": 2000,
                "ram": 300,
            }, 
            worker: {
                "cpu": 500,
                "ram": 100,
            },
        }
    }

    let task: Task = Object.assign({}, taskSimple)
    if (type === 'simple') {
        
    }
    return task
}