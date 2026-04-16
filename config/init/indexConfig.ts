import config from '../index';
import nconf    from 'nconf';
import path    from 'path';

const nconfConfig = new nconf.Provider();
nconfConfig
    .argv()
    .env()
    .file('config', path.join(process.cwd(), "config", "init", "config.json"))
    .file('defaults', path.join(process.cwd(), "config", "init", "config_default.json"));

export function saveConfigArguments() {
    // Priority: CLI arg > config.json > .env (config.*) > hardcoded default
    nconfConfig.set('email',    nconfConfig.get('email')    || config.LOCAL_PORTAL_EMAIL);
    nconfConfig.set('password', nconfConfig.get('password') || config.LOCAL_PORTAL_PASSWORD);
    nconfConfig.set('url',      nconfConfig.get('url')      || config.LOCAL_PORTAL_DOMAIN);
    nconfConfig.set('filehandlerFiles', nconfConfig.get('filehandlerFiles'));
    nconfConfig.set('filesMy', nconfConfig.get('filesMy'));
    nconfConfig.set('foldersMy', nconfConfig.get('foldersMy'));
    nconfConfig.set('sharedIter', nconfConfig.get('sharedIter'));
    nconfConfig.set('pervuIter', nconfConfig.get('pervuIter'));
    nconfConfig.set('constVu', nconfConfig.get('constVu'));
    nconfConfig.set('constArrival', nconfConfig.get('constArrival'));

    let rampArrival = nconfConfig.get('rampArrival');
    if (rampArrival.stages && rampArrival.stages.hasOwnProperty('target')) {
        const ramp_stages = [];
        for (const i in rampArrival.stages.target) {
            ramp_stages.push({
                target: rampArrival.stages.target[i],
                duration: rampArrival.stages.duration[i]
            });
        }
        rampArrival.stages = ramp_stages;
        nconfConfig.set('rampArrival', rampArrival);
    } else {
        nconfConfig.set('rampArrival', nconfConfig.get('rampArrival'));
    }

    nconfConfig.set('extControl', nconfConfig.get('extControl'));

    let rampVus = nconfConfig.get('rampVus');
    if (rampVus.stages && rampVus.stages.hasOwnProperty('target')) {
        const ramp_stages = [];
        for (const i in rampVus.stages.target) {
            ramp_stages.push({
                target: rampVus.stages.target[i],
                duration: rampVus.stages.duration[i]
            });
        }
        rampVus.stages = ramp_stages;
        nconfConfig.set('rampVus', rampVus);
    } else {
        nconfConfig.set('rampVus', nconfConfig.get('rampVus'));
    }

    nconfConfig.set('k6_influxdb_organization', nconfConfig.get('k6_influxdb_organization') || config.K6_INFLUXDB_ORGANIZATION);
    nconfConfig.set('k6_influxdb_bucket',       nconfConfig.get('k6_influxdb_bucket')       || config.K6_INFLUXDB_BUCKET);
    nconfConfig.set('k6_influxdb_token',        nconfConfig.get('k6_influxdb_token')        || config.K6_INFLUXDB_TOKEN);
    nconfConfig.set('k6_influxdb_addr',         nconfConfig.get('k6_influxdb_addr')         || config.K6_INFLUXDB_ADDR);
    nconfConfig.set('k6_elasticsearch_cloud_id',  nconfConfig.get('k6_elasticsearch_cloud_id')  || config.K6_ELASTICSEARCH_CLOUD_ID);
    nconfConfig.set('k6_elasticsearch_user',      nconfConfig.get('k6_elasticsearch_user')      || config.K6_ELASTICSEARCH_USER);
    nconfConfig.set('k6_elasticsearch_password',  nconfConfig.get('k6_elasticsearch_password')  || config.K6_ELASTICSEARCH_PASSWORD);
    nconfConfig.set('k6_prometheus_rw_server_url', nconfConfig.get('k6_prometheus_rw_server_url') || config.K6_PROMETHEUS_RW_SERVER_URL);
    nconfConfig.set('k6_prometheus_rw_username',   nconfConfig.get('k6_prometheus_rw_username')   || config.K6_PROMETHEUS_RW_USERNAME);
    nconfConfig.set('k6_prometheus_rw_password',   nconfConfig.get('k6_prometheus_rw_password')   || config.K6_PROMETHEUS_RW_PASSWORD);

    nconfConfig.set('shared_iter_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('shared_iter_scenario_thresholds')));
    nconfConfig.set('per_vu_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('per_vu_scenario_thresholds')));
    nconfConfig.set('const_vus_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('const_vus_scenario_thresholds')));
    nconfConfig.set('const_arrival_rate_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('const_arrival_rate_scenario_thresholds')));
    nconfConfig.set('ramp_arrival_rate_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('ramp_arrival_rate_scenario_thresholds')));
    nconfConfig.set('ext_controlled_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('ext_controlled_scenario_thresholds')));
    nconfConfig.set('ramp_vus_scenario_thresholds', parseArgumentAsArray(nconfConfig.get('ramp_vus_scenario_thresholds')));

    nconfConfig.save('config');
}

export function parseArgumentAsArray(arg: JSON) {
    // if (typeof arg === 'string' && arg.startsWith('[') && arg.endsWith(']')) {
    //     try {
    //         return JSON.parse(arg);
    //     } catch (error) {
    //         console.error(`Cannot parase as massive: ${arg}`);
    //         return arg;
    //     }
    // }
    return arg;
}
