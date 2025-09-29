import {
    Trend,
    Gauge,
    Metric
} from 'k6/metrics';
import { thresholdsSet } from './params';
import {
    Scenario,
    scenariosOptions
} from "./scenarios";

export class Metrics {
    [name: string]: Metric
}

export class isMetricRecorded {
    [name: string]: boolean
}

let metrics: Metrics = new Metrics();
export function setMetrics(options: scenariosOptions){
    if (!options.scenarios?.list){
        return metrics;
    }
    
    for (let i = 0; i < options.scenarios?.list?.length; i++) {
        let scenario: Scenario = options.scenarios.list[i];
        const key = scenario.executor.replaceAll("-", "_");
        scenario.env['MY_SCENARIO'] = key;
        metrics[key] = new Trend(key, true);

        if (!options.thresholds[key]) {
            options.thresholds[key] = [];
        }
        options.thresholds[key].push(thresholdsSet);
    }
    return metrics;
}

export function setScenarioData(options: scenariosOptions, isRecorded: isMetricRecorded){
    if (!options.scenarios?.list){
        return metrics;
    }
    for (let i = 0; i < options.scenarios?.list?.length; i++) {
        let scenario: Scenario = options.scenarios.list[i];
        const key = scenario.executor.replaceAll("-", "_");
        scenario.env['MY_SCENARIO'] = key;
        let metricName = `${key}_description`;
        metrics[metricName] = new Gauge(metricName, true);
    }
    return metrics;
}
