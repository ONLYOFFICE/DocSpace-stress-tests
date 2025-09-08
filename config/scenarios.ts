import exec   from 'k6/execution';

import {
    constVusScenarioSettings,
    sharedIterationScenarioSettings,
    perVuScenarioSettings,
    constArrivalRateScenarioSettings,
    rampArrivalRateScenarioSettings,
    extControlledScenarioSettings,
    rampVusScenarioSettings,
    const_vus_scenario,
    shared_iter_scenario,
    per_vu_scenario,
    const_arrival_rate_scenario,
    ramp_arrival_rate_scenario,
    ext_controlled_scenario,
    ramp_vus_scenario,
    setThresholds
} from './params';
import {
    isMetricRecorded,
    Metrics
} from "./metrics";

export class Scenario {
    executor: string;
    startRate: number;
    rate: number;
    maxVUs: number;
    vus: number;
    iterations: number;
    startTime: string;
    preAllocatedVUs: number;
    duration: string;
    maxDuration: string;
    gracefulStop: string;
    timeUnit: string;
    env: {
        [name: string]: string;
    };
    stages: [
        {
            "target": number;
            "duration": string;
        }
    ]

    constructor(data: any) {
        this.executor = data.executor;
        this.startRate = data.startRate;
        this.rate = data.rate;
        this.maxVUs = data.maxVUs;
        this.vus = data.vus;
        this.iterations = data.iterations;
        this.startTime = data.startTime;
        this.duration = data.duration;
        this.preAllocatedVUs = data.preAllocatedVUs;
        this.maxDuration = data.maxDuration;
        this.gracefulStop = data.gracefulStop;
        this.timeUnit = data.timeUnit;
        this.env = { 'SCENARIO': data.executor };
        this.stages = data.stages;
    }
}

export class Scenarios {
    list: Scenario[] = [];
    startTime?: string;
    env?: object;
    stages?: object;
}

export class scenariosOptions {
    scenarios: Scenarios | undefined;
    thresholds: any;
}

export function setScenarios(instances) {
    let scenarios: Scenarios = new Scenarios();

    if (constVusScenarioSettings === true || constVusScenarioSettings === "true") {
        scenarios.list.push(const_vus_scenario);
    }
    if (sharedIterationScenarioSettings === true || sharedIterationScenarioSettings === "true") {
        scenarios.list.push(shared_iter_scenario);
    }
    if (perVuScenarioSettings === true || perVuScenarioSettings === "true") {
        scenarios.list.push(per_vu_scenario);
    }
    if (constArrivalRateScenarioSettings === true || constArrivalRateScenarioSettings === "true") {
        scenarios.list.push(const_arrival_rate_scenario);
    }
    if (rampArrivalRateScenarioSettings === true || rampArrivalRateScenarioSettings === "true") {
        scenarios.list.push(ramp_arrival_rate_scenario);
    }
    if (extControlledScenarioSettings === true || extControlledScenarioSettings === "true") {
        scenarios.list.push(ext_controlled_scenario);
    }
    if (rampVusScenarioSettings === true || rampVusScenarioSettings === "true") {
        scenarios.list.push(ramp_vus_scenario);
    }

    let scenariosParallel:Scenarios = new Scenarios();
    if (instances.parallel === true || instances.parallel === "true") {
        for (let inst in instances.instances) {
            for (let i = 0; i < scenarios.list.length; i++) {
                let scenario = scenarios.list[i];
                scenario.startTime = instances.instances[inst].startTime;
                scenariosParallel.list.push(scenario);
            }
        }
    }
    return (instances.parallel === true || instances.parallel === "true") ? scenariosParallel : scenarios;
}

function getScenarioData() {
    const tag = exec.vu.metrics.tags['scenario'];
    if(exec.test?.options?.scenarios) {
        return exec.test?.options?.scenarios[`${tag}`];
    }
}

// export function addTagsDefault(def: boolean, property: string, api?: string | undefined) {
//     let tags = {};
//     let scenarioData = getScenarioData();
//     if (def) {
//         tags = {
//             scenario_executor: scenarioData?.executor,
//             scenario_startTime: scenarioData?.startTime,
//             scenario_gracefulStop: scenarioData?.gracefulStop,
//             scenario_exec: scenarioData?.exec,
//             scenario_vus: scenarioData?.vus,
//             scenario_duration: scenarioData?.duration,
//             scenario_iterations: scenarioData?.iterations,
//             scenario_maxDuration: scenarioData?.maxDuration,
//             scenario_stages: scenarioData?.stages,
//             scenario_gracefulRampDown: scenarioData?.gracefulRampDown,
//             scenario_startVUs: scenarioData?.startVUs,
//             scenario_preAllocatedVUs: scenarioData?.preAllocatedVUs,
//             scenario_rate: scenarioData?.rate,
//             scenario_maxVUs: scenarioData.maxVUs,
//             scenario_timeUnit: scenarioData.timeUnit,
//             scenario_startRate: scenarioData.startRate,
//             property: property,
//         };
//         return tags;
//     } else {
//         tags = {
//             property: property,
//             api: api,
//         };
//         return tags;
//     }
// }

export function initializeScenarioFlags(scenarios: Scenarios, metric: isMetricRecorded) {
    for (let i = 0; i < scenarios.list.length; i++) {
        metric[`${scenarios.list[i].executor}_description`] = false;
    }

}

export function checkScenarioDescription(iteration: number, metric: isMetricRecorded, scenario:string, trend: Metrics) {
    if (iteration === 0 && !metric[`${scenario}_description`]) {
        let scenarioMetric = trend[`${scenario}_description`];
        //scenarioMetric.add(1, addTagsDefault(true, ''));
        metric[`${scenario}_description`] = true;
    }
}
