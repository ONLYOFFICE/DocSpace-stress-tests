import { auth } from '../config/auth.js';
import { RoomCRUD, createRoom, getRoomInfo, renameRoom, removeRoom } from './CRUD.js';
import { setScenarios } from '../config/scenarios.js';
import { setMetrics } from '../config/metrics.js';
import { setParams } from '../config/params.js';

export const options = { 
    scenarios: setScenarios(),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
};

let customMetrics = setMetrics(options);

export function setup() {
    var authToken = auth();
    let params = setParams(authToken);
    return params;
};

export default function (params) {
    RoomCRUD(params, customMetrics, __ENV.MY_SCENARIO);
}