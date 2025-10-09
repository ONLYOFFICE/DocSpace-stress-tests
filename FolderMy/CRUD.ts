import {
    check,
    group
} from 'k6';
import {
    faker
} from '@faker-js/faker';

import {
    authData,
    basePath,
    filesCountFolderMy,
    foldersCountFolderMy,
    instances,
    instPath,
    url,
    wizardData
} from '../config/params';
import {
    foldersAndFiles
} from '../data/data';
import {
    auth
} from '../config/auth';

import {
    Configuration,
    FilesApi,
    FoldersApi,
    OperationsApi
} from '@onlyoffice/docspace-api-typescript-k6';
import {
    Metrics
} from "../config/metrics";

/*-------------------------------------------------FOLDER-------------------------------------------------*/
/*
Function get folder my id
*/
export function getFolderMyId(authToken: string | null | undefined, basePath: string)
{
    if(!authToken) {
        return 0;
    }
    
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = apiInstance.getMyFolder();
    let id : number | undefined = undefined;
    if(check(res, {'Get folderMy': res => res.status === 200})){
        id = res.data.response?.current?.id;
    }
    return id;
}

/*
Function creates folder 
id - id of folder my
params - headers 
*/
export function createFolder(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = apiInstance.createFolder(id, {
        title: faker.word.words(),
    });
    
    //var tags = addTagsDefault(false, 'Create folder', `${path}files/folder/{id}`);
    let result : number | undefined;
    if(check(res, {'Creation folder status': res => res.status === 200}, { property: 'Create folder' })){
        result = res.data.response?.id;
    }
   //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Create folder' });
    return result; 
}

/*
Function get folder info
id - id of folder
params - headers
*/
export function getFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Get folder info', `${path}files/folder/{id}`);
    const res = apiInstance.getFolder(id);
    check(res, {'Get folder info status': res => res.status === 200}, { property: 'Get folder info' });
   // trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Get folder info' });
}

/*
Function update folder
id - id of folder
params - headers
*/
export function updateFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Update folder title', `${path}files/folder/{id}`);
    const res = apiInstance.renameFolder(id, {
        title: faker.word.words(),
    });
    check(res, {'Update folder status': res => res.status === 200}, { property: 'Update folder title' });
    //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Update folder title'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function deleteFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Delete folder', `${path}files/folder/{id}`);
    const res = apiInstance.deleteFolder(id, {
         deleteAfter: false,
         immediately: true
    });
    check(res, { 'Folder delete status': res => res.status === 200 }, { property: 'Delete folder' });
    //trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Delete folder'});
}

/*
Function delete folder
id - id of folder
params - headers
*/
export function insertFileInFolder(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const fileTitle = faker.system.commonFileName('docx');
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Insert file in specified folder', `${basePath}files/folder/{id}/insert`);
    const res = apiInstance.insertFile(id, undefined, fileTitle, true, true);
    check(res, { 'Insertion file status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { api: res.request.url, status: res.status, method: res.request.method,});
}

export function FolderCRUD(idMy: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
    let folderId:number | undefined;

    group('Create folder', () => {
        folderId = createFolder(idMy, authToken, trend, environment, basePath);
    });

    group('Get folder info', () => {
        getFolder(folderId, authToken, trend, environment, basePath);
    });
    
    group('Update folder title', () => {
        updateFolder(folderId, authToken, trend, environment, basePath);
    });

    group('Delete folder', () => {
        deleteFolder(folderId, authToken, trend, environment, basePath);
    });

}

/*-------------------------------------------------FILE-------------------------------------------------*/
/*
Function create a file 
id - id of folder my
params - headers 
*/
export function createFile(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    
    //var tags =  addTagsDefault(false, 'Create file', `${path}files/{id}/file`);
    const fileTitle = faker.system.commonFileName('docx');
    const res = apiInstance.createFile(id, {title: fileTitle, enableExternalExt: true});
    let result:number | undefined = 0;
    if(check(res, {'Creation file status': res => res.status === 200})){
        result = res.data.response?.id;
    }
    //trend[environment].add(res.timings.duration, { api: `${path}files/{id}/file`, status: res.status, method: res.request.method,});
    return result;
}

/*
Function get file info
id - id of file
params - headers
*/
export function getFile(id: number | undefined,  authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    // if(trend)
    // {
    //     var tags = addTagsDefault(false, 'Get file info', `${path}files/file/{id}`);
    // }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = apiInstance.getFileInfo(id);
    
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
export function updateFile(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const fileTitle = faker.system.commonFileName('docx');
    //var tags =  addTagsDefault(false, 'Update file title', `${path}files/file/{id}`);
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = apiInstance.updateFile(id, { title: fileTitle });
    check(res, {'Update file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`, status: res.status, method: res.request.method, });

}

/*
Function delete file
id - id of folder
params - headers
*/
export function deleteFile(id: number | undefined, authToken: string, trend: Metrics | null, environment: string | null, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    // if(trend)
    // {
    //     var tags = addTagsDefault(false, 'Delete file', `${path}files/file/{id}`);
    // }
    //
    const res = apiInstance.deleteFile(id, {deleteAfter: false, immediately: true});
    check(res, { 'File delete status': res => res.status === 200 });
    //if(trend)
    //{
        //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    //}
}

export function FileCRUD(idMy: number,  authToken: string, trend: Metrics, environment: string, basePath: string){
    let fileid: number | undefined;

    group('Create file', () => {
        fileid = createFile(idMy, authToken, trend, environment, basePath);
    });

    group('Get file info', () => {
        getFile(fileid, authToken, trend, environment, basePath);
    });

    group('Update file title', () => {
        updateFile(fileid, authToken, trend, environment, basePath);
    });

    group('Delete file', () => {
        deleteFile(fileid, authToken, trend, environment, basePath);
    });

}

export function emptyTrash(authToken: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new OperationsApi(configuration);
    //var tags =  { property: 'Empty trash folder', api: `${path}files/fileops/emptytrash`};
    const res = apiInstance.emptyTrash();
    check(res, { 'Empty trash status': res => res.status === 200});
}

export function openEdit(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    //var tags =   addTagsDefault(false, 'Open and edit file', `${path}files/file/{id}/openedit`);
    const res = apiInstance.openEditFile(id);
    check(res, {'Open and edit file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}/openedit`, status: res.status, method: res.request.method, });
}

export class SetupData {
    authToken: string | null | undefined;
    idMy: number | undefined;
    constructor(authToken: string | null | undefined, idMy: number | undefined){
        this.authToken = authToken;
        this.idMy = idMy;
    }
}

export function setupFunc(){
    // if(instances.parallel === true|| instances.parallel === "true") {
    //     return  await setupParallel();
    // }
    // else {
        const wizard = wizardData();
        const aData = authData();
        const authToken = auth(basePath, wizard, aData);
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, basePath, authToken);
        return new SetupData(authToken, getFolderMyId(authToken, url));
    // }
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
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, instances.instances[i].url, authToken);
        instances.instances[i].idMy = getFolderMyId(authToken, instances.instances[i].url);
    }
    return instances;
}
