var nconf=require('nconf');
var fs=require('fs');
const path = require('path');
var conf_defaults = require(path.join(__dirname, 'config_default.json'));
var instances_defaults = path.join(__dirname, 'instances_default.json');
var instances = path.join(__dirname, 'instances.json');
var conf_file = path.join(__dirname, 'config.json');

if( ! fs.existsSync(conf_file) ) {
    fs.writeFileSync(conf_file, JSON.stringify(conf_defaults, null, 2) );
}

if( ! fs.existsSync(instances) ) {
    fs.copyFile(instances_defaults, instances, (err) => {
        if (err) throw err;
      });
}

nconf.argv().env().file("config", conf_file);

saveArguments();

function saveArguments(){
    nconf.set("email", nconf.get('email'));
    nconf.set("password", nconf.get('password'));
    nconf.set("url", nconf.get('url'));
    nconf.set("filehandlerFiles", nconf.get('filehandlerFiles'));
    nconf.set("filesMy", nconf.get('filesMy'));
    nconf.set("foldersMy", nconf.get('foldersMy'));
    nconf.set("sharedIter", nconf.get('sharedIter'));
    nconf.set("pervuIter", nconf.get('pervuIter'));
    nconf.set("constVu", nconf.get('constVu'));
    nconf.set("constArrival", nconf.get('constArrival'));

    var rampArrival = nconf.get('rampArrival');
    if (rampArrival.stages.hasOwnProperty('target')){
        let ramp_stages = [];
        for(var i in rampArrival.stages.target){
            ramp_stages.push({target: rampArrival.stages.target[i], duration: rampArrival.stages.duration[i]});
        }
        rampArrival.stages = ramp_stages;
        nconf.set("rampArrival", rampArrival);
    }
    else {
        nconf.set("rampArrival", nconf.get('rampArrival'));
    }

    nconf.set("extControl", nconf.get('extControl'));

    var rampVus = nconf.get('rampVus');
    if (rampVus.stages.hasOwnProperty('target')){
        let ramp_stages = [];
        for(var i in rampVus.stages.target){
            ramp_stages.push({target: rampVus.stages.target[i], duration: rampVus.stages.duration[i]});
        }
        rampVus.stages = ramp_stages;
        nconf.set("rampVus", rampVus);
    }
    else {
        nconf.set("rampVus", nconf.get('rampVus'));
    }

    nconf.set("k6_influxdb_organization", nconf.get('k6_influxdb_organization'));
    nconf.set("k6_influxdb_bucket", nconf.get('k6_influxdb_bucket'));
    nconf.set("k6_influxdb_token", nconf.get('k6_influxdb_token'));
    nconf.set("k6_influxdb_addr", nconf.get('k6_influxdb_addr'));
    nconf.set("k6_elasticsearch_cloud_id", nconf.get('k6_elasticsearch_cloud_id'));
    nconf.set("k6_elasticsearch_user", nconf.get('k6_elasticsearch_user'));
    nconf.set("k6_elasticsearch_password", nconf.get('k6_elasticsearch_password'));
    nconf.set("k6_prometheus_rw_server_url", nconf.get('k6_prometheus_rw_server_url'));
    nconf.set("k6_prometheus_rw_username", nconf.get('k6_prometheus_rw_username'));
    nconf.set("k6_prometheus_rw_password", nconf.get('k6_prometheus_rw_password'));

    nconf.set("shared_iter_scenario_thresholds", nconf.get('shared_iter_scenario_thresholds'));
    nconf.set("per_vu_scenario_thresholds", nconf.get('per_vu_scenario_thresholds'));
    nconf.set("const_vus_scenario_thresholds", nconf.get('const_vus_scenario_thresholds'));
    nconf.set("const_arrival_rate_scenario_thresholds", nconf.get('const_arrival_rate_scenario_thresholds'));
    nconf.set("ramp_arrival_rate_scenario_thresholds", nconf.get('ramp_arrival_rate_scenario_thresholds'));
    nconf.set("ext_controlled_scenario_thresholds", nconf.get('ext_controlled_scenario_thresholds'));
    nconf.set("ramp_vus_scenario_thresholds", nconf.get('ramp_vus_scenario_thresholds'));

    nconf.save();
    

    nconf.file("config", instances);
    nconf.set("parallel", nconf.get('parallel'));
    nconf.set("scenarios", nconf.get('scenarios'));

    var instances_set = nconf.get('instances');
    if (instances_set.hasOwnProperty('tag')){
        let instances_tag = [];
        for(var i in instances_set.tag){
            instances_tag.push({
                tag: instances_set.tag[i], 
                url: instances_set.url[i],
                thresholds: instances_set.thresholds[i],
                startTime: instances_set.hasOwnProperty('startTime') ? instances_set.startTime[i] : null,
                port: instances_set.hasOwnProperty('port') ? instances_set.port[i] : null,
                password: instances_set.hasOwnProperty('password') ? instances_set.password[i] : null,
                email: instances_set.hasOwnProperty('email') ? instances_set.email[i] : null
            });
        }
        instances_set = instances_tag;
        nconf.set("instances", instances_set);
    }
    else {
        nconf.set('instances', nconf.get('instances'));
    }

    nconf.save();

}

