import {
    FileCRUD,
    emptyTrash,
    setupFunc,
    SetupData
} from './CRUD';
import {
    setScenarios
} from '../config/scenarios';
import {
    parallel,
    instances,
    basePath,
    setThresholds
} from '../config/params';
import {
    isMetricRecorded,
    setMetrics,
    setScenarioData
} from '../config/metrics';
import exec from 'k6/execution';
import {
    group
} from 'k6';
import {
    checkScenarioDescription,
    initializeScenarioFlags
} from '../config/scenarios';


//const scenarios_data = setScenarios(instances)
const scenarios_data = setScenarios();
export const options = {
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
};


let customMetrics = setMetrics(options);
let isRecorded = new isMetricRecorded();
let scenarioInfoMetric = setScenarioData(options, isRecorded);

export function setup() {
    let data = setupFunc();
    initializeScenarioFlags(options.scenarios, isRecorded);
    return data;
}

export default function (data: SetupData) {
    if (!data.authToken || !data.idMy) {
        return;
    }

    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isRecorded, scenario, scenarioInfoMetric);

    // if(parallel === true || parallel === "true")
    // {
    //     for(let i in data.instances)
    //     {
    //         const scenarioName = exec.scenario.name;
    //         if(scenarioName === data.instances[i].tag){
    //             group(data.instances[i].tag, () => {
    //                 await FileCRUD(data.instances[i].idMy, data.instances[i].params, customMetrics, scenarioName, data.instances[i].url);
    //             })
    //         }
    //     }
    // }
    // else{
    FileCRUD(data.idMy, data.authToken, customMetrics, exec.scenario.name, basePath);
    // }
};

export function teardown(data: {
    authToken: string | null | undefined,
    idMy: number
}) {
    if (!data.authToken) {
        return;
    }
    // if(parallel === true || parallel === "true")
    // {
    //     for(let i in data.instances){
    //         await emptyTrash(data.instances[i].params, data.instances[i].url);
    //     }
    // }
    // else{
    emptyTrash(data.authToken, basePath);
    //}
}
