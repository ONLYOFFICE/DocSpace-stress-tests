// @ts-nocheck
import { parseArgumentAsArray } from './indexConfig';
import nconf from 'nconf';


const nconfInstances = new nconf.Provider();
nconfInstances.argv().env().file('instances', './instances.json');

export function saveInstancesArguments() {
  nconfInstances.set('parallel', nconfInstances.get('parallel'));
  nconfInstances.set('scenarios', nconfInstances.get('scenarios'));

  let instances_set = nconfInstances.get('instances');
  if (instances_set && instances_set.hasOwnProperty('tag')) {
    const instances_tag = [];
    for (const i in instances_set.tag) {
      instances_tag.push({
        tag: instances_set.tag[i],
        url: instances_set.url[i],
        thresholds: parseArgumentAsArray(instances_set.thresholds[i]),
        startTime: instances_set.hasOwnProperty('startTime') ? instances_set.startTime[i] : null,
        port: instances_set.hasOwnProperty('port') ? instances_set.port[i] : null,
        password: instances_set.hasOwnProperty('password') ? instances_set.password[i] : null,
        email: instances_set.hasOwnProperty('email') ? instances_set.email[i] : null,
      });
    }
    instances_set = instances_tag;
    nconfInstances.set('instances', instances_set);
  } else {
    nconfInstances.set('instances', nconfInstances.get('instances'));
  }

  nconfInstances.save('instances');
}
