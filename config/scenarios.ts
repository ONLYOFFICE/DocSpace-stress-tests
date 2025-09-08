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
    ramp_vus_scenario
} from './params';

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
    env: { SCENARIO: string };
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
        this.env = { SCENARIO: data.executor };
        this.stages = data.stages;
    }
}

export class Scenarios {
    list: Scenario[] = [];
    startTime?: string;
    env?: object;
    stages?: object;
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
                scenariosParallel[`${instances.instances[inst].tag}`] = Object.assign({}, scenario);
            }
        }
    }
    return (instances.parallel === true || instances.parallel === "true") ? scenariosParallel : scenarios;
}

function getScenarioData() {
    const tag = exec.vu.tags['scenario'];
    let jsonData = JSON.parse(JSON.stringify(exec.test.options.scenarios[`${tag}`]));
    let scenarioData = {
        scenario_executor: `${jsonData['executor']}`,
        scenario_startTime: `${jsonData['startTime']}`,
        scenario_gracefulStop: `${jsonData['gracefulStop']}`,
        scenario_exec: `${jsonData['exec']}`,
        scenario_vus: `${jsonData['vus']}`,
        scenario_duration: `${jsonData['duration']}`,
        scenario_iterations: `${jsonData['iterations']}`,
        scenario_maxDuration: `${jsonData['maxDuration']}`,
        scenario_stages: JSON.stringify(`${jsonData['stages']}`),
        scenario_gracefulRampDown: `${jsonData['gracefulRampDown']}`,
        scenario_startVUs: `${jsonData['startVUs']}`,
        scenario_preAllocatedVUs: `${jsonData['preAllocatedVUs']}`,
        scenario_rate: `${jsonData['rate']}`,
        scenario_maxVUs: `${jsonData['maxVUs']}`,
        scenario_timeUnit: `${jsonData['timeUnit']}`,
        scenario_startRate: `${jsonData['startRate']}`,
    }
    return scenarioData;
}

export function addTagsDefault(def: boolean, property: string, api?: string | undefined) {
    let tags = {};
    let scenarioData = getScenarioData();
    if (def) {
        tags = {
            scenario_executor: scenarioData.scenario_executor,
            scenario_startTime: scenarioData.scenario_startTime,
            scenario_gracefulStop: scenarioData.scenario_gracefulStop,
            scenario_exec: scenarioData.scenario_exec,
            scenario_vus: scenarioData.scenario_vus,
            scenario_duration: scenarioData.scenario_duration,
            scenario_iterations: scenarioData.scenario_iterations,
            scenario_maxDuration: scenarioData.scenario_maxDuration,
            scenario_stages: scenarioData.scenario_stages,
            scenario_gracefulRampDown: scenarioData.scenario_gracefulRampDown,
            scenario_startVUs: scenarioData.scenario_startVUs,
            scenario_preAllocatedVUs: scenarioData.scenario_preAllocatedVUs,
            scenario_rate: scenarioData.scenario_rate,
            scenario_maxVUs: scenarioData.scenario_maxVUs,
            scenario_timeUnit: scenarioData.scenario_timeUnit,
            scenario_startRate: scenarioData.scenario_startRate,
            property: property,
        };
        return tags;
    } else {
        tags = {
            property: property,
            api: api,
        };
        return tags;
    }
}

export function initializeScenarioFlags(scenarios: Scenarios, metric) {
    for (let i = 0; i < scenarios.list.length; i++) {
        metric[`${scenarios.list[i].executor}_description`] = false;
    }

}

export function checkScenarioDescription(iteration, metric, scenario, trend) {
    if (iteration === 0 && !metric[`${scenario}_description`]) {
        let scenarioMetric = trend[`${scenario}_description`];
        scenarioMetric.add(1, addTagsDefault(true, ''));
        metric[`${scenario}_description`] = true;
    }
}
