import exec from 'k6/execution';
import http from 'k6/http';
import { sleep } from 'k6';
import { openeditFile } from './filehandler.js';
import { setScenarios } from '../config/scenarios.js';
import { createFile, emptyTrash, setupFunc, deleteFile } from './CRUD.js';
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
export default function (data) {
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    if (__ITER === 0) {
        const fileId = createFile(data.idMy, data.params, customMetrics, exec.scenario.name, basePath);
        if (fileId) {
            createdFileIds.push(fileId);
        }
        openedit = openeditFile(data.params, fileId, basePath);
        callbackUrl = openedit.editorConfig.callbackUrl;
    }
    const payload = JSON.stringify({
        key: openedit.document.key,
        url: openedit.document.url,
        token: openedit.token,
        forcesave: openedit.editorConfig.forcesave,
        fileType: openedit.document.fileType
    });
    const res = http.post(callbackUrl, payload, {
        headers: data.params.headers
        }
    );
    check(res, { 'Callback url status': res => res.status === 200});
    sleep(1); 
};

export function teardown(data) {
    for (const id of createdFileIds) {
        deleteFile(id, data.params, null, null, basePath);
    }
    emptyTrash(data.params, basePath);
}