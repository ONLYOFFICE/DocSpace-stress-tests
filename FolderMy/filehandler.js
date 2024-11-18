import http from 'k6/http';
import { check, group } from 'k6';
import { addTagsDefault } from '../config/scenarios.js';
import { url } from "../config/params.js";

export function downloadAndConvert (params, id, trend, environment) {
    const URL = `${url}/filehandler?action=download&fileid=${id}&outputtype=.pdf`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(false, 'Download and convert file', `filehandler?action=download&fileid=${id}&outputtype=.pdf`),
    });
    check(res, {'Download and convert file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `filehandler?action=download&fileid=${id}&outputtype=.pdf`, status: res.status, method: res.request.method,});
};

export function thumbFile (params, id, trend, environment) {
const URL = `${url}/filehandler?action=thumb&fileid=${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(false, 'Thumbnail file', `filehandler?action=thumb&fileid=${id}`),
    });
    check(res, {'Thumbnail file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `filehandler?action=thumb&fileid=${id}`, status: res.status, method: res.request.method,});
};