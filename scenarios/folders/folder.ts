import {
    FolderCRUD,
    emptyTrash,
    setupFunc,
    SetupData
} from './CRUD';
import { setScenarios } from '../../config/scenarios';
import { basePath, setThresholds } from '../../config/params';
import {
    setMetrics,
    setScenarioData
} from '../../config/metrics';
import exec from 'k6/execution';
import { checkScenarioDescription, initializeScenarioFlags } from '../../config/scenarios';

const scenarios_data = setScenarios();
const thresholds = setThresholds(scenarios_data);
export const options = {
    scenarios: scenarios_data,
    thresholds: thresholds,
};

let customMetrics = setMetrics(options);
let isMetricRecorded = {};
let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);

export async function setup() {
    let data = await setupFunc();
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return data;
};

export default async function (data: SetupData) {
    if (!data.authToken || !data.idMy) {
        return;
    }
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    await FolderCRUD(data.idMy, data.authToken, customMetrics, scenario, basePath);
}

export async function teardown(data: { authToken: string | null | undefined, idMy: number }) {
    if (!data.authToken) {
        return;
    }
    await emptyTrash(data.authToken, basePath);
}
