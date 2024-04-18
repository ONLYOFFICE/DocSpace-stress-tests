import http from 'k6/http';
import { check, group } from 'k6';
import faker  from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import exec from 'k6/execution';

import { folderMy, basePath, path} from '../config/params.js';
import { addTagsDefault } from '../config/scenarios.js';

/*-------------------------------------------------FOLDER-------------------------------------------------*/

/*
Function get folder my id
*/
export function getFolderMyId(params){
    const res = http.get(folderMy, {headers: params.headers, tags: { cutom_tag: `${JSON.stringify(exec.test.options.scenarios)}`}});
    let id = null;
    if(check(res, {'Get folderMy': res => res.status === 200})){
        id = res.json().response.current.id;
    }
    return id;
}

/*
Function create folder 
id - id of folder my
params - headers 
*/
export function createFolder(id, params, trend, environment){
    const folderTitle = faker.random.word();
    const payload = JSON.stringify({
        title:	folderTitle,
    });
    let URL = `${basePath}files/folder/${id}`;
    const res = http.post(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Create folder'),
    });
    let idMy = null;
    if(check(res, {'Cretion folder status': res => res.status === 200})){
        idMy = res.json().response.id;
    }
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method,});
    return idMy; 
}

/*
Function get folder info
id - id of folder
params - headers
*/
export function getFolder(id, params, trend, environment){
    let URL = `${basePath}files/folder/${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get folder info'),
    });
    check(res, {'Get folder info status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method,});
}

/*
Function update folder
id - id of folder
params - headers
*/
export function updateFolder(id, params, trend, environment){
    const folderTitle = faker.random.word();
    const payload = JSON.stringify({
        title: folderTitle,
    });
    let URL = `${basePath}files/folder/${id}`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Update folder title'),
    });
    check(res, {'Update folder status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method,});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function deleteFolder(id, params, trend, environment){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${basePath}files/folder/${id}`;
    const res = http.del(URL, payload, {headers: params.headers,
        tags: addTagsDefault(true, 'Delete folder'),
    });
    check(res, { 'Folder delete status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method,});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function insertFileInFolder(id, params, trend, environment){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        folderId: id,
        Title: fileTitle,
        CreateNewIfExist: true,
        KeepConvertStatus: true,
    });
    let URL = `${basePath}files/folder/${id}/insert`;
    const res = http.post(URL, payload, {headers: params.headers,
        tags: addTagsDefault(true, 'Insert file in specified folder'),
    });
    check(res, { 'Insertion file status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { api: res.request.url, status: res.status, method: res.request.method,});
}

export function FolderCRUD(idMy, params, trend, environment) {
    let folderId = null;

    group('Create folder', () => {
        folderId = createFolder(idMy, params, trend, environment);
    });

    group('Get folder info', () => {
        getFolder(folderId, params, trend, environment);
    });

    group('Update folder title', () => {
        updateFolder(folderId, params, trend, environment);
    });

    group('Delete folder', () => {
        deleteFolder(folderId, params, trend, environment);
    });

};


/*-------------------------------------------------FILE-------------------------------------------------*/

/*
Function create file 
id - id of folder my
params - headers 
*/
export function createFile(id, params, trend, environment){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title:	fileTitle,
        EnableExternalExt: true,
    });

    let URL = `${basePath}files/${id}/file`;
    const res = http.post(URL, payload, {
        headers: params.headers,
        tags: addTagsDefault(true, 'Create file'),
    });
    let idMy = null;
    if(check(res, {'Cretion file status': res => res.status === 200})){
        idMy = res.json().response.id;
    }
    trend[environment].add(res.timings.duration, { api: `${path}files/{id}/file`, status: res.status, method: res.request.method,});
    return idMy;
}

/*
Function get file info
id - id of file
params - headers
*/
export function getFile(id, params, trend, environment){
    let URL = `${basePath}files/file/${id}`;
    let tagsDelete = {};
    if(trend)
    {
        tagsDelete = { tags: addTagsDefault(true, 'Get file info')};
    }
    const res = http.get(URL, {
        headers: params.headers, 
        tags: tagsDelete.tags,
    });
    check(res, {'Get file info status': res => res.status === 200});
    if(trend)
    {
        trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    }
    return res;
}

/*
Function update file
id - id of file
params - headers
*/
export function updateFile(id, params, trend, environment){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title: fileTitle,
    });
    let URL = `${basePath}files/file/${id}`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Update file title'),
    });
    check(res, {'Update file status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`, status: res.status, method: res.request.method, });

}

/*
Function delete file
id - id of folder
params - headers
*/
export function deleteFile(id, params, trend, environment){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${basePath}files/file/${id}`;
    let tagsDelete = {};
    if(trend)
    {
        tagsDelete = { tags: addTagsDefault(true, 'Delete file')};
    }
    const res = http.del(URL, payload, { 
        headers: params.headers, 
        tags: tagsDelete.tags,
    });
    check(res, { 'File delete status': res => res.status === 200 });
    if(trend)
    {
        trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    }
}

export function FileCRUD(idMy, params, trend, environment){
    let fileid = null;

    group('Create file', () => {
        fileid = createFile(idMy, params, trend, environment);
    });

    group('Get file info', () => {
        getFile(fileid, params, trend, environment);
    });

    group('Update file title', () => {
        updateFile(fileid, params, trend, environment);
    });

    group('Delete file', () => {
        deleteFile(fileid, params, trend, environment);
    });

}

export function emptyTrash(params){
    let URL = `${basePath}files/fileops/emptytrash`;
    const res = http.put(URL, {
        headers: params.headers,
    });
    check(res, { 'Empty trash status': res => res.status === 200});
}