import exec from 'k6/execution';

import { constVusScenarioSettings, sharedIterationScenarioSettings, perVuScenarioSettings, constArrivalRateScenarioSettings, rampArrivalRateScenarioSettings, extControlledScenarioSettings, rampVusScenarioSettings,
 const_vus_scenario, shared_iter_scenario, per_vu_scenario, const_arrival_rate_scenario, ramp_arrival_rate_scenario, ext_controlled_scenario, ramp_vus_scenario} from './params.js';

export function setScenarios(instances) {
    let scenarios = {};

    if(constVusScenarioSettings === true){
        scenarios.const_vus_scenario = const_vus_scenario;
    }
    if(sharedIterationScenarioSettings === true){
        scenarios.shared_iter_scenario = shared_iter_scenario;
    }
    if(perVuScenarioSettings === true){
        scenarios.per_vu_scenario = per_vu_scenario;
    }
    if(constArrivalRateScenarioSettings === true){
        scenarios.const_arrival_rate_scenario = const_arrival_rate_scenario;
    }
    if(rampArrivalRateScenarioSettings === true){
        scenarios.ramp_arrival_rate_scenario = ramp_arrival_rate_scenario;
    }
    if(extControlledScenarioSettings === true){
        scenarios.ext_controlled_scenario = ext_controlled_scenario;
    }
    if(rampVusScenarioSettings === true){
        scenarios.ramp_vus_scenario = ramp_vus_scenario;
    }

    let scenariosParallel = {};
    if(instances.parallel === true){
        for(var inst in instances.instances)
        {
            for(var scen in scenarios)
            {
                let scenario = scenarios[scen];
                scenario.startTime = instances.instances[inst].startTime;
                scenariosParallel[`${instances.instances[inst].tag}`] = Object.assign({}, scenario);
            }
        }
    }
    return instances.parallel ? scenariosParallel : scenarios;
}

function getScenarioData()
{
    const tag = exec.vu.tags['scenario'];
    let jsonData = JSON.parse(JSON.stringify(exec.test.options.scenarios[`${tag}`]));
    let scenarioData = {
        scenario_executor: `${jsonData['executor']}`,
        scenario_startTime: `${jsonData['startTime']}`,
        scenario_gracefulStop: `${jsonData['gracefulStop']}`,
        scenario_exec: `${jsonData['exec']}`,
        scenario_vus: `${jsonData['vus']}`,
        scenario_duration: `${jsonData['duration']}`,
        scenario_iterations: `${jsonData['iterations']}`,
        scenario_maxDuration: `${jsonData['maxDuration']}`,
        scenario_stages: JSON.stringify(`${jsonData['stages']}`),
        scenario_gracefulRampDown: `${jsonData['gracefulRampDown']}`,
        scenario_startVUs: `${jsonData['startVUs']}`,
        scenario_preAllocatedVUs: `${jsonData['preAllocatedVUs']}`,
        scenario_rate: `${jsonData['rate']}`,
        scenario_maxVUs: `${jsonData['maxVUs']}`,
        scenario_timeUnit: `${jsonData['timeUnit']}`,
        scenario_startRate: `${jsonData['startRate']}`,
    }
    return scenarioData;
}

export function addTagsDefault(def, property){
    let tags = {};
    let scenarioData = getScenarioData();
    if(def == true)
    {
        tags = {
            scenario_executor: scenarioData.scenario_executor,
            scenario_startTime: scenarioData.scenario_startTime,
            scenario_gracefulStop: scenarioData.scenario_gracefulStop,
            scenario_exec: scenarioData.scenario_exec,
            scenario_vus: scenarioData.scenario_vus,
            scenario_duration: scenarioData.scenario_duration,
            scenario_iterations: scenarioData.scenario_iterations,
            scenario_maxDuration: scenarioData.scenario_maxDuration,
            scenario_stages: scenarioData.scenario_stages,
            scenario_gracefulRampDown: scenarioData.scenario_gracefulRampDown,
            scenario_startVUs: scenarioData.scenario_startVUs,
            scenario_preAllocatedVUs: scenarioData.scenario_preAllocatedVUs,
            scenario_rate: scenarioData.scenario_rate,
            scenario_maxVUs: scenarioData.scenario_maxVUs,
            scenario_timeUnit: scenarioData.scenario_timeUnit,
            scenario_startRate: scenarioData.scenario_startRate,
            property: property,
        };
        return tags;
    }
}