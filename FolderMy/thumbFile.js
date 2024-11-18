import exec from 'k6/execution';

import { auth } from '../config/auth.js';
import { foldersAndFiles } from '../data/data.js';
import { setScenarios } from '../config/scenarios.js';
import { folderMy, setParams, filehandlerDownloadFilesCount} from '../config/params.js';
import { setMetrics, setScenarioData } from '../config/metrics.js';
import { thumbFile } from './filehandler.js';
import { deleteFile, getFile, emptyTrash } from './CRUD.js';
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
    var authToken = auth();
    let {arrayFiles, arrayFolders} = foldersAndFiles(0, filehandlerDownloadFilesCount, folderMy, authToken);
    let params = setParams(authToken);
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return {params, arrayFiles};
};


export default function ({params, arrayFiles}) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    thumbFile(params, arrayFiles[exec.scenario.iterationInTest], customMetrics, exec.scenario.name);
};

export function teardown({params, arrayFiles}) {
    for(var i in arrayFiles){
        let res = getFile(arrayFiles[i], params, null, null);
        check(res, {'Thumbnail file': res => res.json().response.thumbnailStatus === 3});
        deleteFile(arrayFiles[i], params, null, null);
    }
    emptyTrash(params);
}