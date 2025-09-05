import { saveConfigArguments } from './indexConfig';
import { saveInstancesArguments } from './indexInstances';
// nconf is only needed to parse argv/env; setup happens inside the imported modules
import nconf    from 'nconf';

nconf.argv().env();

saveConfigArguments();

saveInstancesArguments();
