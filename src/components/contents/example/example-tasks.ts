import { Task } from '../dispatcher/actions'
import latestVersion from '../../../version.json'
export interface TemplateOptions {
    cmd: string, 
    queuing: string,
    minServiceTime: number,
    maxServiceTime: number,
    workloadSize: number,
    aggregatorTime: number,
    aggregatorFactor: number,
}
export const plankton = (options: TemplateOptions) => {
    const taskSimple: Task = {
        application: {
            name: 'jade-example',
            version: latestVersion.version,
            owner: 'aces.uta.edu',
        }, 
        budget: {
            fanoutTable:[0,100, 300, 600, 1200, 1800, 2400, 3600]
        }, 
        options: {
            updateNetwork: false,
            queuing: options.queuing,
        }, 
        aggregator: {
            image: `robin98/plankton:${latestVersion.version}-amd64`,
            port: 8080,
            input: {},
        }, 
        worker: {
            image: `robin98/plankton:${latestVersion.version}-arm32`,
            port: 8080,
            input: {
                "cmd": options.cmd,
                "size": options.workloadSize,
                "maxEatTime": options.maxServiceTime,
                "minEatTime": options.minServiceTime,
                "digestTime": options.aggregatorTime,
                "digestFactor": options.aggregatorFactor,
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

    return task
}