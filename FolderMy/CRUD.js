import http from 'k6/http';
import { check, group } from 'k6';
import faker  from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import exec from 'k6/execution';

import { folderMy, path, instPath, instances, url, basePath, setParams, filesCountFolderMy, foldersCountFolderMy, wizardData, authData} from '../config/params.js';
import { foldersAndFiles } from '../data/data.js';
import { auth } from '../config/auth.js';
import { addTagsDefault } from '../config/scenarios.js';


/*-------------------------------------------------FOLDER-------------------------------------------------*/

/*
Function get folder my id
*/
export function getFolderMyId(params, path){
    const res = http.get(folderMy(path), {headers: params.headers, tags: { cutom_tag: `${JSON.stringify(exec.test.options.scenarios)}`}});
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
export function createFolder(id, params, trend, environment, url){
    const folderTitle = faker.random.word();
    const payload = JSON.stringify({
        title:	folderTitle,
    });
    let URL = `${url}files/folder/${id}`;
    const res = http.post(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Create folder'),
    });
    let idMy = null;
    if(check(res, {'Cretion folder status': res => res.status === 200}, { property: 'Create folder' })){
        idMy = res.json().response.id;
    }
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Create folder' });
    return idMy; 
}

/*
Function get folder info
id - id of folder
params - headers
*/
export function getFolder(id, params, trend, environment, url){
    let URL = `${url}files/folder/${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get folder info'),
    });
    check(res, {'Get folder info status': res => res.status === 200}, { property: 'Get folder info' });
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Get folder info' });
}

/*
Function update folder
id - id of folder
params - headers
*/
export function updateFolder(id, params, trend, environment, url){
    const folderTitle = faker.random.word();
    const payload = JSON.stringify({
        title: folderTitle,
    });
    let URL = `${url}files/folder/${id}`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Update folder title'),
    });
    check(res, {'Update folder status': res => res.status === 200}, { property: 'Update folder title' });
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Update folder title'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function deleteFolder(id, params, trend, environment, url){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${url}files/folder/${id}`;
    const res = http.del(URL, payload, {headers: params.headers,
        tags: addTagsDefault(true, 'Delete folder'),
    });
    check(res, { 'Folder delete status': res => res.status === 200 }, { property: 'Delete folder' });
    trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Delete folder'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function insertFileInFolder(id, params, trend, environment, url){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        folderId: id,
        Title: fileTitle,
        CreateNewIfExist: true,
        KeepConvertStatus: true,
    });
    let URL = `${url}files/folder/${id}/insert`;
    const res = http.post(URL, payload, {headers: params.headers,
        tags: addTagsDefault(true, 'Insert file in specified folder'),
    });
    check(res, { 'Insertion file status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { api: res.request.url, status: res.status, method: res.request.method,});
}

export function FolderCRUD(idMy, params, trend, environment, url) {
    let folderId = null;

    group('Create folder', () => {
        folderId = createFolder(idMy, params, trend, environment, url);
    });

    group('Get folder info', () => {
        getFolder(folderId, params, trend, environment, url);
    });

    group('Update folder title', () => {
        updateFolder(folderId, params, trend, environment, url);
    });

    group('Delete folder', () => {
        deleteFolder(folderId, params, trend, environment, url);
    });

};


/*-------------------------------------------------FILE-------------------------------------------------*/

/*
Function create file 
id - id of folder my
params - headers 
*/
export function createFile(id, params, trend, environment, url){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title:	fileTitle,
        EnableExternalExt: true,
    });

    let URL = `${url}files/${id}/file`;
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
export function getFile(id, params, trend, environment, url){
    let URL = `${url}files/file/${id}`;
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
export function updateFile(id, params, trend, environment, url){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title: fileTitle,
    });
    let URL = `${url}files/file/${id}`;
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
export function deleteFile(id, params, trend, environment, url){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${url}files/file/${id}`;
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

export function FileCRUD(idMy, params, trend, environment, url){
    let fileid = null;

    group('Create file', () => {
        fileid = createFile(idMy, params, trend, environment, url);
    });

    group('Get file info', () => {
        getFile(fileid, params, trend, environment, url);
    });

    group('Update file title', () => {
        updateFile(fileid, params, trend, environment, url);
    });

    group('Delete file', () => {
        deleteFile(fileid, params, trend, environment, url);
    });

}

export function emptyTrash(params, url){
    let URL = `${url}files/fileops/emptytrash`;
    const payload = JSON.stringify({});
    const res = http.put(URL, payload, {
        headers: params.headers, 
    });
    check(res, { 'Empty trash status': res => res.status === 200});
}

export function openEdit(id, params, trend, environment, url){
    let URL = `${url}files/file/${id}/openedit`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Open and edit file'),
    });
    check(res, {'Open and edit file status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}/openedit`, status: res.status, method: res.request.method, });
}

export function setupFunc(){
    let data = {};
    if(instances.parallel === true|| instances.parallel === "true") {
        data = setupParallel();
        return data;
    }
    else {
        var wizard = wizardData(null, null);
        var authdata = authData(null, null);
        var authToken = auth(basePath, wizard, authdata);
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, folderMy(basePath), authToken);
        data.params = setParams(authToken);
        data.idMy = getFolderMyId(data.params, basePath);
        return data;
    }
}

function setupParallel(){
    for(var i in instances.instances){
        let url = instPath(instances.instances[i].url);
        var wizard = wizardData(instances.instances[i].email, instances.instances[i].password);
        var authdata = authData(instances.instances[i].email, instances.instances[i].password);
        let authToken = auth(url, wizard, authdata);
        if(instances.instances[i].port) {
            instances.instances[i].url = instPath(`${instances.instances[i].url}:${instances.instances[i].port}`)
        }
        else {
        instances.instances[i].url = instPath(`${instances.instances[i].url}`);
        }
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, folderMy(instances.instances[i].url), authToken);
        instances.instances[i].params = setParams(authToken);
        instances.instances[i].idMy = getFolderMyId(instances.instances[i].params, instances.instances[i].url);
    }
    return instances;
}