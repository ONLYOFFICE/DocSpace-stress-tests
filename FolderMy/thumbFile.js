import exec from 'k6/execution';

import { auth } from '../config/auth.js';
import { foldersAndFiles } from '../data/data.js';
import { setScenarios } from '../config/scenarios.js';
import { folderMy, setParams, filehandlerDownloadFilesCount} from '../config/params.js';
import { setMetrics } from '../config/metrics.js';
import { thumbFile } from './filehandler.js';
import { deleteFile, getFile, emptyTrash } from './CRUD.js';


export const options = { 
    scenarios: setScenarios(),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
    thresholds: {},
};

export function setup() {
    var authToken = auth();
    let {arrayFiles, arrayFolders} = foldersAndFiles(0, filehandlerDownloadFilesCount, folderMy, authToken);
    let params = setParams(authToken);
    return {params, arrayFiles};
};

let customMetrics = setMetrics(options);

export default function ({params, arrayFiles}) {
    thumbFile(params, arrayFiles[exec.scenario.iterationInTest], customMetrics, __ENV.MY_SCENARIO);
};

export function teardown({params, arrayFiles}) {
    for(var i in arrayFiles){
        let res = getFile(arrayFiles[i], params, null, null);
        check(res, {'Thumbnail file': res => res.json().response.thumbnailStatus === 3});
        deleteFile(arrayFiles[i], params, null, null);
    }
    emptyTrash(params);
}