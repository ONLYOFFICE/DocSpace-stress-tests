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
    [scenarioName: string]: any; // Allow dynamic properties for scenario names
}

export class scenariosOptions {
    scenarios: Scenarios | undefined;
    thresholds: any;
}

export function setScenarios() {
    let scenarios: Scenarios = new Scenarios();
    let scenarioList: Scenario[] = [];

    if (constVusScenarioSettings === true || constVusScenarioSettings === "true") {
        scenarioList.push(const_vus_scenario);
    }
    if (sharedIterationScenarioSettings === true || sharedIterationScenarioSettings === "true") {
        scenarioList.push(shared_iter_scenario);
    }
    if (perVuScenarioSettings === true || perVuScenarioSettings === "true") {
        scenarioList.push(per_vu_scenario);
    }
    if (constArrivalRateScenarioSettings === true || constArrivalRateScenarioSettings === "true") {
        scenarioList.push(const_arrival_rate_scenario);
    }
    if (rampArrivalRateScenarioSettings === true || rampArrivalRateScenarioSettings === "true") {
        scenarioList.push(ramp_arrival_rate_scenario);
    }
    if (extControlledScenarioSettings === true || extControlledScenarioSettings === "true") {
        scenarioList.push(ext_controlled_scenario);
    }
    if (rampVusScenarioSettings === true || rampVusScenarioSettings === "true") {
        scenarioList.push(ramp_vus_scenario);
    }

    // Convert the list to k6-compatible format
    for (let scenario of scenarioList) {
        const scenarioName = scenario.executor.replaceAll("-", "_");
        scenarios[scenarioName] = {
            executor: scenario.executor,
            vus: scenario.vus,
            duration: scenario.duration,
            iterations: scenario.iterations,
            startTime: scenario.startTime,
            preAllocatedVUs: scenario.preAllocatedVUs,
            maxDuration: scenario.maxDuration,
            gracefulStop: scenario.gracefulStop,
            timeUnit: scenario.timeUnit,
            rate: scenario.rate,
            maxVUs: scenario.maxVUs,
            startRate: scenario.startRate,
            stages: scenario.stages,
            env: scenario.env
        };
        // Remove undefined properties to avoid JSON serialization issues
        Object.keys(scenarios[scenarioName]).forEach(key => {
            if (scenarios[scenarioName][key] === undefined) {
                delete scenarios[scenarioName][key];
            }
        });
    }

    return scenarios;
}

export function initializeScenarioFlags(scenarios: Scenarios, metric: isMetricRecorded) {
    Object.keys(scenarios).forEach(scenarioName => {
        metric[`${scenarioName}_description`] = false;
    });
}

export function checkScenarioDescription(iteration: number, metric: isMetricRecorded, scenario:string, trend: Metrics) {
    if (iteration === 0 && !metric[`${scenario}_description`]) {
        metric[`${scenario}_description`] = true;
    }
}
