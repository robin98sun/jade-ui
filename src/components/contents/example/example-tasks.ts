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
export const plankton = (to: TemplatetOptions):Task => {
    const taskSimple: Task = { 
        options: {
            updateNetwork: false,
            queuing: to.queuing,
            estimatedServiceTimeModel: to.serviceTimeDistribution,
            estimatedMeanServiceTime: to.serviceTime,
        },
        application: {
            name: 'jade-example',
            version: to.version,
            owner: 'aces.uta.edu',
        }, 
        budget: {
            mean: to.budgetMean,
            variance: to.budgetVariance,
            target: to.budgetTarget,
            fanoutTable:[0,100, 300, 600, 1200, 1800, 2400, 3600]
        }, 
        aggregator: {
            image: `${to.registry}/plankton:${latestVersion.version}-amd64`,
            port: 8080,
            input: {},
        }, 
        worker: {
            image: `${to.registry}/plankton:${latestVersion.version}-${to.registry === 'robin98'?'arm32':'amd64'}`,
            port: 8080,
            input: {
                "cmd": to.cmd,
                "size": to.workloadSize,
                "maxEatTime": to.maxServiceTime,
                "minEatTime": to.minServiceTime,
                "digestTime": to.aggregatorTime,
                "digestFactor": to.aggregatorFactor,
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