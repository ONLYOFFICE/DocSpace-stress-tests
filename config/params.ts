import {
    Params
} from 'k6/http';
import {
    Scenario
} from "./scenarios";

const data = JSON.parse(open("../config/init/config.json"));
export const instances = JSON.parse(open("../config/init/instances.json"));
export const parallel = instances.parallel;
/*------------------------------------------------------AUTH settings------------------------------------------------------*/
const email = data.email;
const password = data.password;


export class AuthData {
    UserName: string;
    Password: string;
    constructor(UserName: string, Password: string) {
        this.UserName = UserName;
        this.Password = Password;
    }
}

export class WizardData {
    Email: string;
    PasswordHash: string;
    constructor(Email: string, PasswordHash: string) {
        this.Email = Email;
        this.PasswordHash = PasswordHash;
    }
}

export function authData(emailInst: string | undefined, passwordInst: string | undefined){
    let auth;
    
    if(emailInst && passwordInst){
        auth = new AuthData(emailInst, passwordInst);
    }
    else{
        auth =  new AuthData(email, password);
    }
    return auth;
}

export function wizardData(emailInst: string | undefined, passwordInst: string | undefined){
    let wizard;
    if(emailInst && passwordInst){
        wizard = new WizardData(emailInst, passwordInst);
    }
    else {
        wizard = new WizardData(email, password);
    }
    return wizard;
}


/*--------------------------------------------------------Base URL's--------------------------------------------------------*/
export const path = 'api/2.0/'
export const url = `${data.url}`;
export const basePath = `${url}/${path}`;

export function instPath(basePath:string)
{
    return `${basePath}/${path}`;
}

export function  folderMy(basePath:string){
    return `${basePath}files/@my`;
}
export function folderCommon(basePath:string){
    return `${basePath}files/@common`;
}
export function folderRecent(basePath:string){
    return `${basePath}files/@recent`;
}
export function folderTrash(basePath:string){
    return `${basePath}files/@trash`;
}
export function privateRoom(basePath:string){
    return `${basePath}files/@privacy`;
}
export function folderTemplates(basePath:string){
    return `${basePath}files/@templates`;
}
export function folderShared(basePath:string){
    return `${basePath}files/@share`;
}
export function wizardComplete(basePath:string){
    return `${basePath}settings/wizard/complete`;
}
export function authentication(basePath:string){
    return `${basePath}authentication`;
}
export function rooms(basePath:string){
    return `${basePath}files/rooms`;
}

/*------------------------------------------------Starting data for the test------------------------------------------------*/
export const filesCountFolderMy = data.filesMy;
export const foldersCountFolderMy = data.foldersMy;
export const filehandlerDownloadFilesCount = data.filehandlerFiles;

/*-------------------------------------------------------TEST SETTINGS-------------------------------------------------------*/

export function setParams(authToken:string){
    let result: Params;
    
    if (authToken) {
        result = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        };
        return result;
    }

    result = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    return result;
    
}

export const thresholdsSet = 'avg < 2000';


/*------------SHARED ITERATIONS SCENARIO------------*/

//Enable scenario true or false
export const sharedIterationScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.sharedIter : data.sharedIter.enable;

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
export const perVuScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.pervuIter : data.pervuIter.enable;

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
export const constVusScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.constVu : data.constVu.enable;

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
export const constArrivalRateScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.constArrival : data.constArrival.enable;

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
export const rampArrivalRateScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.rampArrival : data.rampArrival.enable;

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
export const extControlledScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.extControl : data.extControl.enable;

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
export const rampVusScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.rampVus : data.rampVus.enable;

export const ramp_vus_scenario = {
    executor: 'ramping-vus',
    startVUs: data.rampVus.startVUs,
    stages: data.rampVus.stages,
    gracefulRampDown: data.rampVus.duration,
    startTime: data.rampVus.startTime,
    env: { SCENARIO: 'ramping-vus' },
};


export function setThresholds(scenarios:Scenario) {
    const thresholds = {};

    Object.keys(scenarios).forEach((scenarioName) => {
        const threshold = data[`${scenarioName}_thresholds`];
        const scenario = scenarios[scenarioName as keyof Scenario];

        // if (threshold && scenario) {
        //     if (!scenario.tags) {
        //         scenario.tags = { scenario: scenarioName };
        //     }
        //     thresholds[`http_req_duration{scenario:${scenario.tags.scenario}}`] = threshold;
        // }
        // else if((parallel === "true" || parallel === true) && scenario)
        // {
        //     for(var i in instances.instances)
        //     {
        //         if(scenarioName === instances.instances[i].tag)
        //         {
        //             if (!scenario.tags) {
        //                 scenario.tags = { scenario: scenarioName };
        //             }
        //             thresholds[`http_req_duration{scenario:${scenario.tags.scenario}}`] = instances.instances[i].thresholds;
        //         }
        //     }
        // }
        
    });

    return thresholds;
}
