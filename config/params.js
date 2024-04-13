const data = JSON.parse(open("../config/init/config.json"));
/*------------------------------------------------------AUTH settings------------------------------------------------------*/
const email1 = data.email;
const password = data.password;

export const authData = { UserName : `${email1}`, Password: `${password}`,};
export const wizardData = { Email : `${email1}`, PasswordHash : `${password}`,}


/*--------------------------------------------------------Base URL's--------------------------------------------------------*/
export const path = 'api/2.0/'
export const basePath = `http://localhost:8092/api/2.0/`;

export const folderMy = `${basePath}files/@my`;
export const folderCommon = `${basePath}files/@common`;
export const folderRecent = `${basePath}files/@recent`;
export const folderTrash = `${basePath}files/@trash`;
export const privateRoom = `${basePath}files/@privacy`;
export const folderTemplates = `${basePath}files/@templates`;
export const folderShared = `${basePath}files/@share`;
export const wizardComplete = `${basePath}settings/wizard/complete`;
export const authentication = `${basePath}authentication`;
export const rooms = `${basePath}files/rooms`;


/*------------------------------------------------Starting data for the test------------------------------------------------*/
export const filesCountFolderMy = data.filesMy;
export const foldersCountFolderMy = data.foldersMy;


/*-------------------------------------------------------TEST SETTINGS-------------------------------------------------------*/
export function setParams(authToken){
    let params = {};
    if(authToken)
    {
        params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`,
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
export const sharedIterationScenarioSettings = data.sharedIter.enable;

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
export const perVuScenarioSettings = data.pervuIter.enable;

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
export const constVusScenarioSettings = data.constVu.enable;

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
export const constArrivalRateScenarioSettings = data.constArrival.enable;

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
export const rampArrivalRateScenarioSettings = data.rampArrival.enable;

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
export const extControlledScenarioSettings = data.extControl.enable;

export const ext_controlled_scenario = {
    executor: 'externally-controlled',
    vus: data.extControl.vus,
    maxVUs: data.extControl.maxVus,
    duration: data.extControl.duration,
    startTime: data.extControl.startTime,
    env: { SCENARIO: 'externally-controlled' },
};
