import { RoomCRUD, setupFunc } from './CRUD';
import { setScenarios } from '../../config/scenarios';
import { setMetrics, setScenarioData } from '../../config/metrics';
import { basePath, setThresholds } from '../../config/params';
import exec from 'k6/execution';
import { checkScenarioDescription, initializeScenarioFlags } from '../../config/scenarios';

const scenarios_data = setScenarios();
export const options = {
    scenarios: scenarios_data,
    thresholds: setThresholds(scenarios_data),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

let customMetrics = setMetrics(options);
let isMetricRecorded = {};
let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);

export async function setup() {
    let data = await setupFunc();
    isMetricRecorded = {};
    initializeScenarioFlags(options.scenarios, isMetricRecorded);
    return data;
}

export default async function (authToken: string | null | undefined) {
    if (!authToken) {
        return;
    }
    let scenario = exec.scenario.name;
    checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
    await RoomCRUD(authToken, customMetrics, exec.scenario.name, basePath);
}
