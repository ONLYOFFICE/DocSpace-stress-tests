// @ts-nocheck
import exec from 'k6/execution';

import { auth } from '../config/auth';
import { foldersAndFiles } from '../data/data';
import { setScenarios } from '../config/scenarios';
import { folderMy, setParams, filehandlerDownloadFilesCount, instances, setThresholds } from '../config/params';
import { setMetrics, setScenarioData } from '../config/metrics';
import { thumbFile } from './filehandler';
import { deleteFile, getFile, emptyTrash } from './CRUD';
import {checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios';

const scenarios_data = setScenarios(instances)
export const options = { 
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
};

let customMetrics = 0;
let isMetricRecorded = {};
let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);

export function setup() {
    const authToken = auth();
    let {arrayFiles, arrayFolders} = foldersAndFiles(0, filehandlerDownloadFilesCount, folderMy, authToken);
    let params = setParams(authToken);
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return {params, arrayFiles};
};


export default async function ({params, arrayFiles}) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    thumbFile(params, arrayFiles[exec.scenario.iterationInTest], customMetrics, exec.scenario.name);
};

export async function teardown({params, arrayFiles}) {
    for(let i in arrayFiles){
        let res = getFile(arrayFiles[i], params, null, null);
        check(res, {'Thumbnail file': res => res.json().response.thumbnailStatus === 3});
        await deleteFile(arrayFiles[i], params, null, null);
    }
    await emptyTrash(params);
}
