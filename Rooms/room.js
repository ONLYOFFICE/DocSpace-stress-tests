import { RoomCRUD, setupFunc } from './CRUD.js';
import { setScenarios } from '../config/scenarios.js';
import { setMetrics } from '../config/metrics.js';
import { basePath, parallel } from '../config/params.js';
import exec from 'k6/execution';

export const options = { 
    scenarios: setScenarios(),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

let customMetrics = setMetrics(options);

export function setup() {
    let data = setupFunc();
    return data;
};

export default function (data) {
    if(parallel)
    {
        for(var i in data.instances)
        {
            if(exec.scenario.name === data.instances[i].tag){
                group(data.instances[i].tag, () => {
                    RoomCRUD(data.instances[i].params, customMetrics, __ENV.MY_SCENARIO, data.instances[i].url);
                })
            }
        }
    }
    else{
        RoomCRUD(data.params, customMetrics, __ENV.MY_SCENARIO, basePath);
    }
}