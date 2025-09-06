// @ts-nocheck
import exec from 'k6/execution';
import http from 'k6/http';
import { sleep } from 'k6';
import { openeditFile } from './filehandler';
import { setScenarios } from '../config/scenarios';
import { createFile, emptyTrash, setupFunc, deleteFile, getFile } from './CRUD';
import { parallel, instances, basePath, setThresholds } from '../config/params';
import { setMetrics, setScenarioData } from '../config/metrics';
import { checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios';
import { check } from 'k6';
import { b64encode } from 'k6/encoding';
import { hmac } from 'k6/crypto';

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
}

let callbackUrl;
let createdFileIds = [];
let openedit;
let fileId;
let tokenCompact;

function base64url(str) {
    return b64encode(str, 'rawstd')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

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

        const secret = 'secret';

        const header = {
            alg: "HS256",
            typ: "JWT"
        };

        const payload = {
            key: openedit.document.key,
            status: 1,
            actions: [{
                type: 0,
                userid: openedit.editorConfig.user.id
            }],
            users: [openedit.editorConfig.user.id],
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600
        };

        const encodedHeader = base64url(JSON.stringify(header));
        const encodedPayload = base64url(JSON.stringify(payload));
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        const signature = base64url(hmac('sha256', secret, signatureInput, 'binary'));

        tokenCompact = `${signatureInput}.${signature}`;
        const getFileAfterMinute = getFile(fileId, data.params, customMetrics, exec.scenario.name, basePath);
        check(getFileAfterMinute, { 'File status before callback': file => file.json().response.fileStatus === 0});
    }

    const payload = JSON.stringify({
        status: 1,
        key: openedit.document.key,
        url: openedit.document.url,
        token: tokenCompact,
        users: [openedit.editorConfig.user.id],
        actions: [
            {
                type: 1,
                userid: openedit.editorConfig.user.id
            }
        ],
        encrypted: false,
        forceSaveType: 0
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
    check(getFileRightAway, { 'File status after callback': file => file.json().response.fileStatus == 1});

    /*
    Wait 1 minute
    */
    sleep(65); 
};

export async function teardown(data) {
    for (const id of createdFileIds) {
        await deleteFile(id, data.params, null, null, basePath);
    }
    await emptyTrash(data.params, basePath);
}
