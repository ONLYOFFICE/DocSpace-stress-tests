const { saveConfigArguments } = require('./indexConfig.js');
const { saveInstancesArguments } = require('./indexInstances.js');
var nconf=require('nconf');

nconf.argv().env();

saveConfigArguments();

saveInstancesArguments();