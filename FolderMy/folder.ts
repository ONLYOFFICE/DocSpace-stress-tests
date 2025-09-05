// @ts-nocheck
import { FolderCRUD, emptyTrash, setupFunc } from "./CRUD";
import { setScenarios } from '../config/scenarios';
import { parallel, instances, basePath, setThresholds } from '../config/params';
import { setMetrics, setScenarioData } from '../config/metrics';
import exec from 'k6/execution';
import { group } from 'k6';
import {checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios';

const scenarios_data = setScenarios(instances)
const thresholds = setThresholds(scenarios_data);
export const options = { 
    scenarios: scenarios_data,
    thresholds: thresholds,
};

let customMetrics = 0;
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
        for(let i in data.instances)
        {
            const scenarioName = exec.scenario.name;
            if(scenarioName === data.instances[i].tag){
                group(data.instances[i].tag, () => {
                FolderCRUD(data.instances[i].idMy, data.instances[i].params, customMetrics, scenarioName, data.instances[i].url);
                })
            }
        }
    }
    else{
        FolderCRUD(data.idMy, data.params, customMetrics, scenario, basePath);
    }
}

export function teardown(data) {
    if(parallel === true || parallel === "true") 
    {
        for(let i in data.instances){
            emptyTrash(data.instances[i].params, data.instances[i].url);
        }
    }
    else{
        emptyTrash(data.params, basePath);
    }
}
