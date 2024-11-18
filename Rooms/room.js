import { RoomCRUD, setupFunc } from './CRUD.js';
import { setScenarios } from '../config/scenarios.js';
import { setMetrics, setScenarioData } from '../config/metrics.js';
import { basePath, parallel } from '../config/params.js';
import exec from 'k6/execution';
import { checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios.js';

const scenarios_data = setScenarios(instances)
export const options = { 
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

let customMetrics = setMetrics(options);
let isMetricRecorded = {};
let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);

export function setup() {
    let data = setupFunc();
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return data;
};

export default function (data) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);

    if(parallel === true || parallel === "true")
    {
        for(var i in data.instances)
        {
            var scenarioName = exec.scenario.name;
            if(scenarioName === data.instances[i].tag){
                group(data.instances[i].tag, () => {
                    RoomCRUD(data.instances[i].params, customMetrics, scenarioName, data.instances[i].url);
                })
            }
        }
    }
    else{
        RoomCRUD(data.params, customMetrics, exec.scenario.name, basePath);
    }
}