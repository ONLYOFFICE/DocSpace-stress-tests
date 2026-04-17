import {
    FileCRUD,
    emptyTrash,
    setupFunc,
    SetupData
} from './CRUD';
import { setScenarios } from '../../config/scenarios';
import { basePath, setThresholds } from '../../config/params';
import {
    isMetricRecorded,
    setMetrics,
    setScenarioData
} from '../../config/metrics';
import exec from 'k6/execution';
import { checkScenarioDescription, initializeScenarioFlags } from '../../config/scenarios';

const scenarios_data = setScenarios();
export const options = {
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
};

let customMetrics = setMetrics(options);
let isRecorded = new isMetricRecorded();
let scenarioInfoMetric = setScenarioData(options, isRecorded);

export async function setup() {
    let data = await setupFunc();
    initializeScenarioFlags(options.scenarios, isRecorded);
    return data;
}

export default async function (data: SetupData) {
    if (!data.authToken || !data.idMy) {
        return;
    }
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isRecorded, scenario, scenarioInfoMetric);
    await FileCRUD(data.idMy, data.authToken, customMetrics, exec.scenario.name, basePath);
};

export async function teardown(data: { authToken: string | null | undefined, idMy: number }) {
    if (!data.authToken) {
        return;
    }
    await emptyTrash(data.authToken, basePath);
}
