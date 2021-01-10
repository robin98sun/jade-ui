import { Task } from '../dispatcher/actions'
import latestVersion from '../../../version.json'
export interface TemplateOptions {
    registry: string,
    serviceTime: number,
    serviceTimeDistribution: string|string[],
    cmd: string|string[], 
    version: string,
    queuing: string|string[],
    minServiceTime: number,
    maxServiceTime: number,
    workloadSize: number,
    aggregatorTime: number,
    aggregatorFactor: number,
    budgetMean: number,
    budgetVariance: number,
    budgetTarget: number,
}
export const plankton = (options: TemplateOptions) => {
    const taskSimple: Task = {
        application: {
            name: 'jade-example',
            version: options.version,
            owner: 'aces.uta.edu',
        }, 
        budget: {
            mean: options.budgetMean,
            variance: options.budgetVariance,
            target: options.budgetTarget,
            fanoutTable:[0,100, 300, 600, 1200, 1800, 2400, 3600]
        }, 
        options: {
            updateNetwork: false,
            queuing: options.queuing,
        }, 
        aggregator: {
            image: `${options.registry}/plankton:${latestVersion.version}-amd64`,
            port: 8080,
            input: {},
        }, 
        worker: {
            image: `${options.registry}/plankton:${latestVersion.version}-${options.registry === 'robin98'?'arm32':'amd64'}`,
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
                    "value": "NY"
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