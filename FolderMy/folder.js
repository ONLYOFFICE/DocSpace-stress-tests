import { auth } from '../config/auth.js';
import { foldersAndFiles } from '../data/data.js';
import { FolderCRUD, createFolder, getFolder, updateFolder, deleteFolder, getFolderMyId } from "./CRUD.js";
import { setScenarios } from '../config/scenarios.js';
import { folderMy, filesCountFolderMy, foldersCountFolderMy, setParams } from '../config/params.js';
import { setMetrics } from '../config/metrics.js';

export const options = { 
    scenarios: setScenarios(),
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
    thresholds: {},
};

export function setup() {
    var authToken = auth();
    foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, folderMy, authToken);
    let params = setParams(authToken);
    const idMy = getFolderMyId(params);
    return {params, idMy};
};

let customMetrics = setMetrics(options);

export default function ({params, idMy}) {
    FolderCRUD(idMy, params, customMetrics, __ENV.MY_SCENARIO);
}