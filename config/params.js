const data = JSON.parse(open("../config/init/config.json"));
export const instances = JSON.parse(open("../config/init/instances.json"));
export const parallel = instances.parallel;
/*------------------------------------------------------AUTH settings------------------------------------------------------*/
const email = data.email;
const password = data.password;

export const authData = { UserName : `${email}`, Password: `${password}`,};
export const wizardData = { Email : `${email}`, PasswordHash : `${password}`,}


/*--------------------------------------------------------Base URL's--------------------------------------------------------*/
export const path = 'api/2.0/'
export const url = `${data.url}`;
export const basePath = `${url}/${path}`;

export function instPath(basePath)
{
    const instUrl = `${basePath}/${path}`;
    return instUrl;
}

export function  folderMy(basePath){
    const folderMy = `${basePath}files/@my`;
    return folderMy;
}
export function folderCommon(basePath){
    const folderCommon = `${basePath}files/@common`;
    return folderCommon;
}
export function folderRecent(basePath){
    const folderRecent = `${basePath}files/@recent`;
    return folderRecent;
}
export function folderTrash(basePath){
    const folderTrash = `${basePath}files/@trash`;
    return folderTrash;
}
export function privateRoom(basePath){
    const privateRoom = `${basePath}files/@privacy`;
    return privateRoom;
}
export function folderTemplates(basePath){
    const folderTemplates = `${basePath}files/@templates`;
    return folderTemplates;
}
export function folderShared(basePath){
    const folderShared = `${basePath}files/@share`;
    return folderShared;
}
export function wizardComplete(basePath){
    const wizardComplete = `${basePath}settings/wizard/complete`;
    return wizardComplete;
}
export function authentication(basePath){
    const authentication = `${basePath}authentication`;
    return authentication;
}
export function rooms(basePath){
    const rooms = `${basePath}files/rooms`;
    return rooms;
}

/*------------------------------------------------Starting data for the test------------------------------------------------*/
export const filesCountFolderMy = data.filesMy;
export const foldersCountFolderMy = data.foldersMy;
export const filehandlerDownloadFilesCount = data.filehandlerFiles;

/*-------------------------------------------------------TEST SETTINGS-------------------------------------------------------*/
export function setParams(authToken){
    let params = {};
    if(authToken)
    {
        params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${(authToken)}`,
            }
        }
        return params;
    }
    else
    {
        params = { 
            headers: {
                'Content-Type': 'application/json',
            }
        }
        return params;
    }
};

export const thresholdsSet = 'avg < 2000';


/*------------SHARED ITERATIONS SCENARIO------------*/

//Enable scenario true or false
export const sharedIterationScenarioSettings = parallel ? instances.scenarios.sharedIter : data.sharedIter.enable;

export const shared_iter_scenario = {
    executor: 'shared-iterations',
    vus: data.sharedIter.vus,
    iterations: data.sharedIter.iterations,
    startTime: data.sharedIter.startTime,
    maxDuration: data.sharedIter.maxDuration,
    gracefulStop: data.sharedIter.gracefulStop,
    env: { SCENARIO: 'shared-iterations' },
};


/*----------------PER VU ITERATIONS----------------*/

//Enable scenario true or false
export const perVuScenarioSettings = parallel ? instances.scenarios.pervuIter : data.pervuIter.enable;

export const per_vu_scenario = {
    executor: 'per-vu-iterations',
    vus: data.pervuIter.vus,
    iterations: data.pervuIter.iterations,
    maxDuration: data.pervuIter.maxDuration,
    startTime: data.pervuIter.startTime,
    gracefulStop: data.pervuIter.gracefulStop,
    env: { SCENARIO: 'per-vu-iterations' },
};


/*------------------CONSTANT VUs------------------*/

//Enable scenario true or false
export const constVusScenarioSettings = parallel ? instances.scenarios.constVu : data.constVu.enable;

export const const_vus_scenario = {
    executor: 'constant-vus', 
    vus: data.constVu.vus,
    duration: data.constVu.duration,
    startTime: data.constVu.startTime,
    gracefulStop: data.constVu.gracefulStop,
    env: { SCENARIO: 'constant-vus' },
};


/*-------------CONSTANT ARRIVAL RATE-------------*/

//Enable scenario true or false
export const constArrivalRateScenarioSettings = parallel ? instances.scenarios.constArrival : data.constArrival.enable;

export const const_arrival_rate_scenario = {
    executor: 'constant-arrival-rate',
    duration: data.constArrival.duration,
    rate: data.constArrival.rate,
    timeUnit: data.constArrival.timeUnit,
    preAllocatedVUs: data.constArrival.preAllocatedVUs,
    maxVUs: data.constArrival.maxVus,
    startTime: data.constArrival.startTime,
    gracefulStop: data.constArrival.gracefulStop,
    env: { SCENARIO: 'constant-arrival-rate' },
};


/*-------------RAMPING ARRIVAL RATE-------------*/

//Enable scenario true or false
export const rampArrivalRateScenarioSettings = parallel ? instances.scenarios.rampArrival : data.rampArrival.enable;

export const ramp_arrival_rate_scenario = {
    executor: 'ramping-arrival-rate',
    startRate: data.rampArrival.startRate,
    timeUnit: data.rampArrival.timeUnit,
    preAllocatedVUs: data.rampArrival.preAllocatedVUs,
    stages: data.rampArrival.stages,
    maxVUs: data.rampArrival.maxVus,
    startTime: data.rampArrival.startTime,
    gracefulStop: data.rampArrival.gracefulStop,
    env: { SCENARIO: 'ramping-arrival-rate' },
};


/*-------------EXTERNALLY CONTROLLED-------------*/

//Enable scenario true or false
export const extControlledScenarioSettings = parallel ? instances.scenarios.extControl : data.extControl.enable;

export const ext_controlled_scenario = {
    executor: 'externally-controlled',
    vus: data.extControl.vus,
    maxVUs: data.extControl.maxVus,
    duration: data.extControl.duration,
    startTime: data.extControl.startTime,
    env: { SCENARIO: 'externally-controlled' },
};

/*-------------RAMPING VUS-------------*/

//Enable scenario true or false
export const rampVusScenarioSettings = parallel ? instances.scenarios.rampVus : data.rampVus.enable;

export const ramp_vus_scenario = {
    executor: 'ramping-vus',
    startVUs: data.rampVus.startVUs,
    stages: data.rampVus.stages,
    gracefulRampDown: data.rampVus.duration,
    startTime: data.rampVus.startTime,
    env: { SCENARIO: 'ramping-vus' },
};
