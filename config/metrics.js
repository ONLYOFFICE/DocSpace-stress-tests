import { Trend } from 'k6/metrics';
import { thresholdsSet } from './params.js';

let metrics = {};

export function setMetrics(options){
    for (let key in options.scenarios) {
        options.scenarios[key].env['MY_SCENARIO'] = key;
        let metricName = key;
        metrics[key] = new Trend(metricName, true);

        if (!options.thresholds[key]) {
            options.thresholds[key] = [];
        }
        options.thresholds[key].push(thresholdsSet);
    };
    return metrics;
}