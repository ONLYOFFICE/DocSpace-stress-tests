import { saveConfigArguments } from './indexConfig.js';
import { saveInstancesArguments } from './indexInstances.js';
var nconf=require('nconf');

nconf.argv().env();

saveConfigArguments();

saveInstancesArguments();