import { saveConfigArguments } from './config/init/indexConfig';
import { saveInstancesArguments } from './config/init/indexInstances';
// nconf is only needed to parse argv/env; setup happens inside the imported modules
import nconf    from 'nconf';

nconf.argv().env();

saveConfigArguments();

saveInstancesArguments();

export default nconf;