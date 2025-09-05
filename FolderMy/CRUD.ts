import http, {
    Params
} from 'k6/http';
import { check, group } from 'k6';
import { faker } from '@faker-js/faker';
import exec from 'k6/execution';

import {
    folderMy,
    path,
    instPath,
    instances,
    url,
    basePath,
    setParams,
    filesCountFolderMy,
    foldersCountFolderMy,
    wizardData,
    authData
} from '../config/params';
import { foldersAndFiles } from '../data/data';
import { auth } from '../config/auth';
import { addTagsDefault } from '../config/scenarios';

/*-------------------------------------------------FOLDER-------------------------------------------------*/
/*
Function get folder my id
*/
export function getFolderMyId(params: Params, pathMy: string){
    const res = http.get(folderMy(pathMy), {headers: params.headers, tags: { property: 'Get folder my', api: `${path}files/@my`}});
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
export function createFolder(id: number, params: Params, trend: any[], environment: string, url: string){
    const folderTitle = faker.word.words();
    const payload = JSON.stringify({
        title:	folderTitle,
    });
    let URL = `${url}files/folder/${id}`;
    params.tags = addTagsDefault(false, 'Create folder', `${path}files/folder/{id}`);
    const res = http.post(URL, payload, params);
    let idMy = null;
    if(check(res, {'Cretion folder status': res => res.status === 200}, { property: 'Create folder' })){
        idMy = res.json().response.id;
    }
   //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Create folder' });
    return idMy; 
}

/*
Function get folder info
id - id of folder
params - headers
*/
export function getFolder(id: number, params: Params, trend: any[], environment: string, url: string){
    let URL = `${url}files/folder/${id}`;
    params.tags = addTagsDefault(false, 'Get folder info', `${path}files/folder/{id}`);
    const res = http.get(URL, params);
    check(res, {'Get folder info status': res => res.status === 200}, { property: 'Get folder info' });
   // trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Get folder info' });
}

/*
Function update folder
id - id of folder
params - headers
*/
export function updateFolder(id: number, params: Params, trend: any[], environment: string, url: string){
    const folderTitle = faker.word.words();
    const payload = JSON.stringify({
        title: folderTitle,
    });
    let URL = `${url}files/folder/${id}`;
    params.tags = addTagsDefault(false, 'Update folder title', `${path}files/folder/{id}`);
    const res = http.put(URL, payload, params);
    check(res, {'Update folder status': res => res.status === 200}, { property: 'Update folder title' });
    //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Update folder title'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function deleteFolder(id: number, params: Params, trend: any[], environment: string, url: string){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${url}files/folder/${id}`;
    params.tags = addTagsDefault(false, 'Delete folder', `${path}files/folder/{id}`);
    const res = http.del(URL, payload, params);
    check(res, { 'Folder delete status': res => res.status === 200 }, { property: 'Delete folder' });
    //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Delete folder'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function insertFileInFolder(id: number, params: Params, trend: any[], environment: string, url: string){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        folderId: id,
        Title: fileTitle,
        CreateNewIfExist: true,
        KeepConvertStatus: true,
    });
    let URL = `${url}files/folder/${id}/insert`;
    params.tags = addTagsDefault(false, 'Insert file in specified folder', URL);
    const res = http.post(URL, payload, params);
    check(res, { 'Insertion file status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { api: res.request.url, status: res.status, method: res.request.method,});
}

export function FolderCRUD(idMy: number, params: Params, trend: any[], environment: string, url: string) {
    let folderId:number;

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
export function createFile(id: number, params: Params, trend: any[], environment: string, url: string){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title:	fileTitle,
        EnableExternalExt: true,
    });

    let URL = `${url}files/${id}/file`;
    params.tags =  addTagsDefault(false, 'Create file', `${path}files/{id}/file`);
    const res = http.post(URL, payload, params);
    let idMy:number = 0;
    if(check(res, {'Cretion file status': res => res.status === 200})){
        idMy = res.json().response.id;
    }
    //trend[environment].add(res.timings.duration, { api: `${path}files/{id}/file`, status: res.status, method: res.request.method,});
    return idMy;
}

/*
Function get file info
id - id of file
params - headers
*/
export function getFile(id: number, params: Params, trend: any[], environment: string, url: string){
    let URL = `${url}files/file/${id}`;
    if(trend)
    {
        params.tags = addTagsDefault(false, 'Get file info', `${path}files/file/{id}`);
    }

    const res = http.get(URL, params);
    
    check(res, {'Get file info status': res => res.status === 200});
    //if(trend)
    //{
      //  trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    //}
    return res;
}

/*
Function update file
id - id of file
params - headers
*/
export function updateFile(id: number, params: Params, trend: any[], environment: string, url: string){
    const fileTitle = faker.system.commonFileName('docx');
    const payload = JSON.stringify({
        title: fileTitle,
    });
    let URL = `${url}files/file/${id}`;
    params.tags =  addTagsDefault(false, 'Update file title', `${path}files/file/{id}`);
    const res = http.put(URL, payload, params);
    check(res, {'Update file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`, status: res.status, method: res.request.method, });

}

/*
Function delete file
id - id of folder
params - headers
*/
export function deleteFile(id: number, params: Params, trend: any[] | null, environment: string | null, url: string){
    const payload = JSON.stringify({
        DeleteAfter: false,
        Immediately: true,
    });
    let URL = `${url}files/file/${id}`;
    if(trend)
    {
        params.tags = addTagsDefault(false, 'Delete file', `${path}files/file/{id}`);
    }
    
    const res = http.del(URL, payload, params);
    check(res, { 'File delete status': res => res.status === 200 });
    //if(trend)
    //{
        //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    //}
}

export function FileCRUD(idMy: number, params: Params, trend: any[], environment: string, url: string){
    let fileid: number;

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

export function emptyTrash(params: Params, url: string){
    let URL = `${url}files/fileops/emptytrash`;
    const payload = JSON.stringify({});
    params.tags =  { property: 'Empty trash folder', api: `${path}files/fileops/emptytrash`};
    const res = http.put(URL, payload, params);
    check(res, { 'Empty trash status': res => res.status === 200});
}

export function openEdit(id: number, params: Params, trend: any[], environment: string, url: string){
    let URL = `${url}files/file/${id}/openedit`;
    params.tags =   addTagsDefault(false, 'Open and edit file', `${path}files/file/{id}/openedit`);
    const res = http.get(URL, params);
    check(res, {'Open and edit file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}/openedit`, status: res.status, method: res.request.method, });
}

export function setupFunc(){
    if(instances.parallel === true|| instances.parallel === "true") {
        return  setupParallel();
    }
    else {
        const wizard = wizardData(undefined, undefined);
        const authdata = authData(undefined, undefined);
        const authToken = auth(basePath, wizard, authdata);
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, folderMy(basePath), authToken);
        const params = setParams(authToken);

        return {
            params: params,
            idMy: getFolderMyId(params, basePath)
        };
    }
}

function setupParallel(){
    for(let i in instances.instances){
        let url = instPath(instances.instances[i].url);
        const wizard = wizardData(instances.instances[i].email, instances.instances[i].password);
        const authdata = authData(instances.instances[i].email, instances.instances[i].password);
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
