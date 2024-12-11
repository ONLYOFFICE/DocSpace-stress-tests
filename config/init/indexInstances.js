import parseArgumentAsArray from './indexConfig.js'
const nconf = require('nconf');
const fs = require('fs');
const path = require('path');
const instances_defaults = path.join(__dirname, 'instances_default.json');
const instances_file = path.join(__dirname, 'instances.json');

if (!fs.existsSync(instances_file)) {
    fs.copyFile(instances_defaults, instances_file, (err) => {
        if (err) throw err;
    });
}

const nconfInstances = new nconf.Provider();
nconfInstances.argv().env().file("instances", instances_file);

function saveInstancesArguments() {
    nconfInstances.set("parallel", nconfInstances.get('parallel'));
    nconfInstances.set("scenarios", nconfInstances.get('scenarios'));

    var instances_set = nconfInstances.get('instances');
    if (instances_set.hasOwnProperty('tag')){
        let instances_tag = [];
        for(var i in instances_set.tag){
            instances_tag.push({
                tag: instances_set.tag[i], 
                url: instances_set.url[i],
                thresholds: parseArgumentAsArray(instances_set.thresholds[i]),
                startTime: instances_set.hasOwnProperty('startTime') ? instances_set.startTime[i] : null,
                port: instances_set.hasOwnProperty('port') ? instances_set.port[i] : null,
                password: instances_set.hasOwnProperty('password') ? instances_set.password[i] : null,
                email: instances_set.hasOwnProperty('email') ? instances_set.email[i] : null
            });
        }
        instances_set = instances_tag;
        nconfInstances.set("instances", instances_set);
    }
    else {
        nconfInstances.set('instances', nconfInstances.get('instances'));
    }

    nconfInstances.save("instances");
}

module.exports = {
    saveInstancesArguments
};