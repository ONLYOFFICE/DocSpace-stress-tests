import http from 'k6/http';
import { check, group } from 'k6';
import { addTagsDefault } from '../config/scenarios.js';
import { url } from "../config/params.js";

export function downloadAndConvert (params, id, trend, environment) {
    const URL = `${url}/filehandler?action=download&fileid=${id}&outputtype=.pdf`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Download and convert file'),
    });
    check(res, {'Download and convert file status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `filehandler?action=download&fileid=${id}&outputtype=.pdf`, status: res.status, method: res.request.method,});
};

export function thumbFile (params, id, trend, environment) {
const URL = `${url}/filehandler?action=thumb&fileid=${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Thumbnail file'),
    });
    check(res, {'Thumbnail file status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `filehandler?action=thumb&fileid=${id}`, status: res.status, method: res.request.method,});
};