import {
    Scenario,
    Scenarios
} from "./scenarios";

let data: any;
try { data = JSON.parse(open("../config/init/config.json")); }
catch { data = JSON.parse(open("../config/init/config_default.json")); }

let instances_raw: any;
try { instances_raw = JSON.parse(open("../config/init/instances.json")); }
catch { instances_raw = JSON.parse(open("../config/init/instances_default.json")); }
export const instances = instances_raw;
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

export function authData(emailInst?: string | undefined, passwordInst?: string | undefined){
    let auth;
    
    if(emailInst && passwordInst){
        auth = new AuthData(emailInst, passwordInst);
    }
    else{
        auth =  new AuthData(email, password);
    }
    return auth;
}

export function wizardData(emailInst?: string | undefined, passwordInst?: string | undefined){
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
export const url = `${data.url}`;
export const basePath = `${url}`;

export function instPath(basePath:string)
{
    return `${basePath}`;
}

export function  folderMy(basePath:string){
    return `${basePath}files/@my`;
}


export function rooms(basePath:string){
    return `${basePath}files/rooms`;
}

/*------------------------------------------------Starting data for the test------------------------------------------------*/
export const filesCountFolderMy = data.filesMy;
export const foldersCountFolderMy = data.foldersMy;
export const filehandlerDownloadFilesCount = data.filehandlerFiles;

/*-------------------------------------------------------TEST SETTINGS-------------------------------------------------------*/

export const thresholdsSet = 'avg < 2000';


/*------------SHARED ITERATIONS SCENARIO------------*/

//Enable scenario true or false
export const sharedIterationScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.sharedIter : data.sharedIter.enable;

export const shared_iter_scenario = new Scenario(data.sharedIter);


/*----------------PER VU ITERATIONS----------------*/

//Enable scenario true or false
export const perVuScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.pervuIter : data.pervuIter.enable;

export const per_vu_scenario = new Scenario(data.pervuIter);


/*------------------CONSTANT VUs------------------*/

//Enable scenario true or false
export const constVusScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.constVu : data.constVu.enable;

export const const_vus_scenario = new Scenario(data.constVu);


/*-------------CONSTANT ARRIVAL RATE-------------*/

//Enable scenario true or false
export const constArrivalRateScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.constArrival : data.constArrival.enable;

export const const_arrival_rate_scenario = new Scenario(data.constArrival);


/*-------------RAMPING ARRIVAL RATE-------------*/

//Enable scenario true or false
export const rampArrivalRateScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.rampArrival : data.rampArrival.enable;

export const ramp_arrival_rate_scenario = new Scenario(data.rampArrival);


/*-------------EXTERNALLY CONTROLLED-------------*/

//Enable scenario true or false
export const extControlledScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.extControl : data.extControl.enable;

export const ext_controlled_scenario = new Scenario(data.extControl);

/*-------------RAMPING VUS-------------*/

//Enable scenario true or false
export const rampVusScenarioSettings = (parallel === true|| parallel === "true") ? instances.scenarios.rampVus : data.rampVus.enable;

export const ramp_vus_scenario = new Scenario(data.rampVus);


export function setThresholds(scenarios:Scenarios) {
    const thresholds = {};

    // for (let i = 0; i < scenarios.list.length; i++) {
    //     const scenario = scenarios.list[i];
    //     const scenarioName = scenario.executor;
    //     const threshold = data[`${scenarioName}_thresholds`];
    //    
    //     // if (threshold && scenario) {
    //     //     if (!scenario.tags) {
    //     //         scenario.tags = {
    //     //             scenario: scenarioName
    //     //         };
    //     //     }
    //     //    
    //     //     thresholds[`http_req_duration{scenario:${scenario.tags.scenario}}`] = threshold;
    //     // } else if ((parallel === "true" || parallel === true) && scenario) 
    //     // {
    //     //     for (var i1 in instances.instances) {
    //     //         if (scenarioName === instances.instances[i1].tag) {
    //     //             if (!scenario.tags) {
    //     //                 scenario.tags = {scenario: scenarioName};
    //     //             }
    //     //             thresholds[`http_req_duration{scenario:${scenario.tags.scenario}}`] = instances.instances[i].thresholds;
    //     //         }
    //     //     }
    //     // }
    // }
    //});

    return thresholds;
}
