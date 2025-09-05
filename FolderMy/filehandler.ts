// @ts-nocheck
import http, {
    Params
} from 'k6/http';
import { check, group } from 'k6';
import { addTagsDefault } from '../config/scenarios';
import { url, basePath, path } from "../config/params";

export function downloadAndConvert (params: Params, id, trend, environment) {
    const URL = `${url}/filehandler?action=download&fileid=${id}&outputtype=.pdf`;
    params.tags = addTagsDefault(false, 'Download and convert file', `filehandler?action=download&fileid={id}&outputtype=.pdf`);
    const res = http.get(URL, params);
    check(res, {'Download and convert file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `filehandler?action=download&fileid=${id}&outputtype=.pdf`, status: res.status, method: res.request.method,});
}

export function thumbFile (params: Params, id, trend, environment) {
    const URL = `${url}/filehandler?action=thumb&fileid=${id}`;
    params.tags = addTagsDefault(false, 'Thumbnail file', `filehandler?action=thumb&fileid={id}`);
    const res = http.get(URL, params);
    check(res, {'Thumbnail file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `filehandler?action=thumb&fileid=${id}`, status: res.status, method: res.request.method,});
}

export function openeditFile (params: Params, fileId, url){
    const URL = `${url}files/file/${fileId}/openedit`;
    params.tags = addTagsDefault(false, 'Open edit file', `${path}files/file/{id}`);
    const res = http.get(URL, params);
    return res.json().response;
}
