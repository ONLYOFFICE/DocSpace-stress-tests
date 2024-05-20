var nconf=require('nconf');
var fs=require('fs');
const path = require('path');
var conf_defaults = require(path.join(__dirname, 'config_default.json'));
var instances = path.join(__dirname, 'instances.json');
var conf_file = path.join(__dirname, 'config.json');

if( ! fs.existsSync(conf_file) ) {
    fs.writeFileSync(conf_file, JSON.stringify(conf_defaults, null, 2) );
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
    nconf.set("rampArrival", nconf.get('rampArrival'));
    nconf.set("extControl", nconf.get('extControl'));
    nconf.set("rampVus", nconf.get('rampVus'));
    nconf.save();

    nconf.file("config", instances);
    nconf.set("parallel", nconf.get('parallel'));
    nconf.set("scenarios", nconf.get('scenarios'));
    nconf.set('instances', nconf.get('instances'));
    console.log(nconf.get('instances'));
    nconf.save();

}

