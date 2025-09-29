// import exec from 'k6/execution';
//
// import { auth } from '../config/auth';
// import { foldersAndFiles } from '../data/data';
// import { setScenarios } from '../config/scenarios';
// import { folderMy, setParams, filehandlerDownloadFilesCount, instances, setThresholds, basePath } from '../config/params';
// import { setMetrics, setScenarioData } from '../config/metrics';
// import { downloadAndConvert } from './filehandler';
// import { deleteFile, emptyTrash } from './CRUD';
// import {checkScenarioDescription, initializeScenarioFlags } from '../config/scenarios';
// import {
//     Params
// } from "k6/http";
//
// const scenarios_data = setScenarios(instances)
// export const options = { 
//     scenarios: scenarios_data,
//     thresholds: setThresholds(scenarios_data),
// };
//
// let customMetrics = 0;
// let isMetricRecorded = {};
// let scenarioInfoMetric = setScenarioData(options, isMetricRecorded);
//
// export function setup() {
//     const authToken = auth(basePath);
//     let {arrayFiles, arrayFolders} = foldersAndFiles(0, filehandlerDownloadFilesCount, folderMy(basePath), authToken);
//     let params = setParams(authToken);
//     isMetricRecorded = {};
//     initializeScenarioFlags(options.scenarios, isMetricRecorded);
//     return {params, arrayFiles};
// };
//
// export default function (authToken: string, arrayFiles:number[]) {
//     let scenario = exec.scenario.name;
//     checkScenarioDescription(exec.scenario.iterationInInstance, isMetricRecorded, scenario, scenarioInfoMetric);
//     downloadAndConvert(authToken, arrayFiles[exec.scenario.iterationInTest], customMetrics, exec.scenario.name);
// };
//
// export function teardown(authToken: string, arrayFiles:number[]) {
//     for(const i in arrayFiles){
//         await deleteFile(arrayFiles[i], authToken, null, null, basePath);
//     }
//     await emptyTrash(authToken, basePath);
// }
