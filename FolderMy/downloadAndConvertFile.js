import exec from 'k6/execution';

import { auth } from '../config/auth.js';
import { foldersAndFiles } from '../data/data.js';
import { setScenarios } from '../config/scenarios.js';
import { folderMy, setParams, filehandlerDownloadFilesCount} from '../config/params.js';  
import { setMetrics, setScenarioData } from '../config/metrics.js';
import { downloadAndConvert } from './filehandler.js';
import { deleteFile, emptyTrash } from './CRUD.js';
import { basePath } from '../config/params.js';
import {checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios.js';

const scenarios_data = setScenarios(instances)
export const options = { 
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
};

let customMetrics = 0;
let isMetricRecorded = {};
let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);

export function setup() {
    var authToken = auth(basePath);
    let {arrayFiles, arrayFolders} = foldersAndFiles(0, filehandlerDownloadFilesCount, folderMy, authToken);
    let params = setParams(authToken);
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return {params, arrayFiles};
};

export default function ({params, arrayFiles}) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    downloadAndConvert(params, arrayFiles[exec.scenario.iterationInTest], customMetrics, exec.scenario.name);
};

export function teardown({params, arrayFiles}) {
    for(var i in arrayFiles){
        deleteFile(arrayFiles[i], params, null, null, basePath);
    }
    emptyTrash(params, basePath);
}