import { Task } from '../dispatcher/actions'
import latestVersion from '../../../version.json'
export interface TemplateOptions {
    registry: string,
    serviceTimeDistribution: string|string[],
    meanServiceTime: number,
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
export const plankton = (to: TemplateOptions):Task => {
    const taskSimple: Task = { 
        options: {
            updateNetwork: false,
            queuing: to.queuing,
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
            input: to.cmd && to.cmd !== 'none' ? {
                "cmd": to.cmd,
                "size": to.workloadSize,
                "maxEatTime": to.maxServiceTime,
                "minEatTime": to.minServiceTime,
                "digestTime": to.aggregatorTime,
                "digestFactor": to.aggregatorFactor,
            }: {}
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
                "cpu": 4000,
                "ram": 2000,
            }, 
            worker: {
                "cpu": 2000,
                "ram": 400,
            },
        }
    }

    if (to.serviceTimeDistribution && to.serviceTimeDistribution !== 'none') {
        taskSimple.options = Object.assign(taskSimple.options, {
            estimatedServiceTimeModel: to.serviceTimeDistribution,
            estimatedMeanServiceTime: to.meanServiceTime,
        })
    }
    let task: Task = Object.assign({}, taskSimple)
    return task
}