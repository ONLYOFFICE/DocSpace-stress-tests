import exec from 'k6/execution';
import http from 'k6/http';
import { sleep } from 'k6';
import { openeditFile } from './filehandler.js';
import { setScenarios } from '../config/scenarios.js';
import { createFile, emptyTrash, setupFunc, deleteFile, getFile } from './CRUD.js';
import { parallel, instances, basePath, setThresholds } from '../config/params.js';
import { setMetrics, setScenarioData } from '../config/metrics.js';
import { checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios.js';
import { check } from 'k6';

const scenarios_data = setScenarios(instances)
export const options = { 
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
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

let callbackUrl;
let createdFileIds = [];
let token;
let openedit;
let fileId;

export default function (data) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    
    /*
    Created a file, called openedit and received callbackUrl 
    */
    if (__ITER === 0) {
        fileId = createFile(data.idMy, data.params, customMetrics, exec.scenario.name, basePath);
        if (fileId) {
            createdFileIds.push(fileId);
        }
        openedit = openeditFile(data.params, fileId, basePath);
        callbackUrl = openedit.editorConfig.callbackUrl;
    }

    /*
    Received file status before callbackUrl and after minute
    */
    const getFileAfterMinute = getFile(fileId, data.params, customMetrics, exec.scenario.name, basePath);
    check(getFileAfterMinute, { 'File status': file => file.json().response.fileStatus != 1});

    const payload = JSON.stringify({
        status: 1,
        key: openedit.document.key,
        url: openedit.document.url,
        token: openedit.token,
        fileType: openedit.document.fileType
    });
    const res = http.post(callbackUrl, payload, {
        headers: data.params.headers
        }
    );
    check(res, { 'Callback url status': res => res.status === 200});

    /*
    Received file status right after callbackUrl
    */
    const getFileRightAway = getFile(fileId, data.params, customMetrics, exec.scenario.name, basePath);
    check(getFileRightAway, { 'File status': file => file.json().response.fileStatus == 1});

    /*
    Wait 1 minute
    */
    sleep(60); 
};

export function teardown(data) {
    for (const id of createdFileIds) {
        deleteFile(id, data.params, null, null, basePath);
    }
    emptyTrash(data.params, basePath);
}