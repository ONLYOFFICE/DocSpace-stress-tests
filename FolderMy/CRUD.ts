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

import {
    FilesFilesApi,
    FilesFoldersApi,
    FilesOperationsApi,
    Configuration
} from '@onlyoffice/docspace-api-typescript';

/*-------------------------------------------------FOLDER-------------------------------------------------*/
/*
Function get folder my id
*/
export async function getFolderMyId(authToken: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    const res = await apiInstance.getMyFolder();
    let id : number | undefined = undefined;
    if(check(res, {'Get folderMy': res => res.status === 200})){
        id = res.data.response?.current?.id;
    }
    return id;
}

/*
Function create folder 
id - id of folder my
params - headers 
*/
export async function createFolder(id: number, authToken: string, trend: any[], environment: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    const res = await apiInstance.createFolder(id, {
        title: faker.word.words(),
    });
    
    //var tags = addTagsDefault(false, 'Create folder', `${path}files/folder/{id}`);
    let result : number | undefined = undefined;
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
export async function getFolder(id: number | undefined, authToken: string, trend: any[], environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Get folder info', `${path}files/folder/{id}`);
    const res = await apiInstance.getFolder(id);
    check(res, {'Get folder info status': res => res.status === 200}, { property: 'Get folder info' });
   // trend[environment].add(res.timings.duration, { api: `${path}files/folder/{id}`, status: res.status, method: res.request.method, property: 'Get folder info' });
}

/*
Function update folder
id - id of folder
params - headers
*/
export async function updateFolder(id: number | undefined, authToken: string, trend: any[], environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Update folder title', `${path}files/folder/{id}`);
    const res = await apiInstance.renameFolder(id, {
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
export async function deleteFolder(id: number | undefined, authToken: string, trend: any[], environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Delete folder', `${path}files/folder/{id}`);
    const res = await apiInstance.deleteFolder(id, {
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
export async function insertFileInFolder(id: number, authToken: string, trend: any[], environment: string, basePath: string){
    const fileTitle = faker.system.commonFileName('docx');
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFoldersApi(configuration);
    //var tags = addTagsDefault(false, 'Insert file in specified folder', `${basePath}files/folder/{id}/insert`);
    const res = await apiInstance.insertFile(id, undefined, fileTitle, true, true);
    check(res, { 'Insertion file status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { api: res.request.url, status: res.status, method: res.request.method,});
}

export async function FolderCRUD(idMy: number, authToken: string, trend: any[], environment: string, basePath: string) {
    let folderId:number | undefined;

    await group('Create folder', async () => {
        folderId = await createFolder(idMy, authToken, trend, environment, basePath);
    });

    await group('Get folder info', async () => {
        await getFolder(folderId, authToken, trend, environment, basePath);
    });
    
    await group('Update folder title', async () => {
        await updateFolder(folderId, authToken, trend, environment, basePath);
    });

    await group('Delete folder', async () => {
        await deleteFolder(folderId, authToken, trend, environment, basePath);
    });

}

/*-------------------------------------------------FILE-------------------------------------------------*/
/*
Function create a file 
id - id of folder my
params - headers 
*/
export async function createFile(id: number, authToken: string, trend: any[], environment: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFilesApi(configuration);
    
    //var tags =  addTagsDefault(false, 'Create file', `${path}files/{id}/file`);
    const fileTitle = faker.system.commonFileName('docx');
    const res = await apiInstance.createFile(id, {title: fileTitle, enableExternalExt: true});
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
export async function getFile(id: number | undefined,  authToken: string, trend: any[], environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    // if(trend)
    // {
    //     var tags = addTagsDefault(false, 'Get file info', `${path}files/file/{id}`);
    // }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFilesApi(configuration);
    const res = await apiInstance.getFileInfo(id);
    
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
export async function updateFile(id: number | undefined, authToken: string, trend: any[], environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const fileTitle = faker.system.commonFileName('docx');
    //var tags =  addTagsDefault(false, 'Update file title', `${path}files/file/{id}`);
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFilesApi(configuration);
    const res = await apiInstance.updateFile(id, { title: fileTitle });
    check(res, {'Update file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`, status: res.status, method: res.request.method, });

}

/*
Function delete file
id - id of folder
params - headers
*/
export async function deleteFile(id: number | undefined, authToken: string, trend: any[] | null, environment: string | null, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFilesApi(configuration);
    // if(trend)
    // {
    //     var tags = addTagsDefault(false, 'Delete file', `${path}files/file/{id}`);
    // }
    //
    const res = await apiInstance.deleteFile(id, {deleteAfter: false, immediately: true});
    check(res, { 'File delete status': res => res.status === 200 });
    //if(trend)
    //{
        //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}`,  status: res.status, method: res.request.method,});
    //}
}

export async function FileCRUD(idMy: number,  authToken: string, trend: any[], environment: string, basePath: string){
    let fileid: number | undefined;

    await group('Create file', async () => {
        fileid = await createFile(idMy, authToken, trend, environment, basePath);
    });

    await group('Get file info', async () => {
        await getFile(fileid, authToken, trend, environment, basePath);
    });

    await group('Update file title', async () => {
        await updateFile(fileid, authToken, trend, environment, basePath);
    });

    await group('Delete file', async () => {
        await deleteFile(fileid, authToken, trend, environment, basePath);
    });

}

export async function emptyTrash(authToken: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesOperationsApi(configuration);
    //var tags =  { property: 'Empty trash folder', api: `${path}files/fileops/emptytrash`};
    const res = await apiInstance.emptyTrash();
    check(res, { 'Empty trash status': res => res.status === 200});
}

export async function openEdit(id: number, authToken: string, trend: any[], environment: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesFilesApi(configuration);
    //var tags =   addTagsDefault(false, 'Open and edit file', `${path}files/file/{id}/openedit`);
    const res = await apiInstance.openEdit(id);
    check(res, {'Open and edit file status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { api: `${path}files/file/{id}/openedit`, status: res.status, method: res.request.method, });
}

export function setupFunc(){
    if(instances.parallel === true|| instances.parallel === "true") {
        return  setupParallel();
    }
    else {
        const wizard = wizardData();
        const aData = authData();
        const authToken = auth(basePath, wizard, aData);
        foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, folderMy(basePath), authToken);
        const params = setParams(authToken);

        return {
            params: params,
            idMy: getFolderMyId(authToken, url)
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
        instances.instances[i].idMy = getFolderMyId(authToken, instances.instances[i].url);
    }
    return instances;
}
