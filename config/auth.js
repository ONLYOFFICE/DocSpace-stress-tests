import http from 'k6/http';
import { wizardData, authData, wizardComplete, authentication, setParams } from './params.js';

export function auth(basePath) {
    let url = `${basePath}settings?withPassword=true`;
    let params = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
  
    let res = http.get(url, params);
    let response = null;

    if(res.status === 200) {
      response = res.json().response;
    }
    if(response.wizardToken) {
      url = wizardComplete(basePath);
      params = {
        headers: {
          'Content-Type': 'application/json',
          'confirm': `${res.wizardToken}`
        }
      };
      const payload = JSON.stringify(wizardData);
  
      res = http.put(url, payload, params);
      return res.cookies.asc_auth_key[0].value;
    }
  
    url = authentication(basePath);
    params = setParams(null);
    const payload = JSON.stringify(authData);
  
    res = http.post(url, payload, params);
    let token = null;
    if(res.status === 200) {
      token = res.json().response.token;
    }
    return token;
  }