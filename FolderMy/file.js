import { FileCRUD, emptyTrash, setupFunc } from './CRUD.js';
import { setScenarios } from '../config/scenarios.js';
import { parallel, instances, basePath } from '../config/params.js';
import { setMetrics } from '../config/metrics.js';

import exec from 'k6/execution';
import { check, group } from 'k6';

export const options = { 
    scenarios: setScenarios(instances),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
    thresholds: {},
};

export function setup() {
    let data = setupFunc();
    return data;
};

let customMetrics = setMetrics(options);

export default function (data) {
    if(parallel === true || parallel === "true")
    {
        for(var i in data.instances)
        {
            var scenarioName = exec.scenario.name;
            if(scenarioName === data.instances[i].tag){
                group(data.instances[i].tag, () => {
                    FileCRUD(data.instances[i].idMy, data.instances[i].params, customMetrics, scenarioName, data.instances[i].url);
                })
            }
        }
    }
    else{
        FileCRUD(data.idMy, data.params, customMetrics, exec.scenario.name, basePath);
    }
};

export function teardown(data) {
    if(parallel === true || parallel === "true")
    {
        for(var i in data.instances){
            emptyTrash(data.instances[i].params, data.instances[i].url);
        }
    }
    else{
        emptyTrash(data.params, basePath);
    }
}