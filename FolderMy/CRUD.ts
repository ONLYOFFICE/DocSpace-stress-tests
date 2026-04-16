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
export async function getFolderMyId(authToken: string | null | undefined, basePath: string)
{
    if(!authToken) {
        return 0;
    }

    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.getMyFolder();
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
export async function createFolder(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.createFolder({
        folderId: id,
        createFolder: { title: faker.word.words() }
    });

    let result : number | undefined;
    if(check(res, {'Creation folder status': res => res.status === 200}, { property: 'Create folder' })){
        result = res.data.response?.id;
    }
    return result;
}

/*
Function get folder info
id - id of folder
params - headers
*/
export async function getFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.getFolder({ folderId: id });
    check(res, {'Get folder info status': res => res.status === 200}, { property: 'Get folder info' });
}

/*
Function update folder
id - id of folder
params - headers
*/
export async function updateFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.renameFolder({
        folderId: id,
        createFolder: { title: faker.word.words() }
    });
    check(res, {'Update folder status': res => res.status === 200}, { property: 'Update folder title' });
}

/*
Function delete folder
id - id of folder
params - headers
*/
export async function deleteFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.deleteFolder({
        folderId: id,
        deleteFolder: { deleteAfter: false, immediately: true }
    });
    check(res, { 'Folder delete status': res => res.status === 200 }, { property: 'Delete folder' });
}

/*
Function insert file in folder
id - id of folder
params - headers
*/
export async function insertFileInFolder(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const fileTitle = faker.system.commonFileName('docx');
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.insertFile({
        folderId: id,
        insertFileTitle: fileTitle,
        insertFileCreateNewIfExist: true,
        insertFileKeepConvertStatus: true
    });
    check(res, { 'Insertion file status': res => res.status === 200 });
}

export async function FolderCRUD(idMy: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
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
export async function createFile(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);

    const fileTitle = faker.system.commonFileName('docx');
    const res = await apiInstance.createFile({
        folderId: id,
        createFileJsonElement: { title: fileTitle, enableExternalExt: true }
    });
    let result:number | undefined = 0;
    if(check(res, {'Creation file status': res => res.status === 200})){
        result = res.data.response?.id;
    }
    return result;
}

/*
Function get file info
id - id of file
params - headers
*/
export async function getFile(id: number | undefined,  authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.getFileInfo({ fileId: id });

    check(res, {'Get file info status': res => res.status === 200});
    return res;
}

/*
Function update file
id - id of file
params - headers
*/
export async function updateFile(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const fileTitle = faker.system.commonFileName('docx');
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.updateFile({
        fileId: id,
        updateFile: { title: fileTitle }
    });
    check(res, {'Update file status': res => res.status === 200});
}

/*
Function delete file
id - id of folder
params - headers
*/
export async function deleteFile(id: number | undefined, authToken: string, trend: Metrics | null, environment: string | null, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.deleteFile({
        fileId: id,
        _delete: { deleteAfter: false, immediately: true }
    });
    check(res, { 'File delete status': res => res.status === 200 });
}

export async function FileCRUD(idMy: number,  authToken: string, trend: Metrics, environment: string, basePath: string){
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
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new OperationsApi(configuration);
    const res = await apiInstance.emptyTrash();
    check(res, { 'Empty trash status': res => res.status === 200});
}

export async function openEdit(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.openEditFile({ fileId: id });
    check(res, {'Open and edit file status': res => res.status === 200});
}

export class SetupData {
    authToken: string | null | undefined;
    idMy: number | undefined;
    constructor(authToken: string | null | undefined, idMy: number | undefined){
        this.authToken = authToken;
        this.idMy = idMy;
    }
}

export async function setupFunc(){
    // if(instances.parallel === true|| instances.parallel === "true") {
    //     return  await setupParallel();
    // }
    // else {
        const wizard = wizardData();
        const aData = authData();
        const authToken = await auth(basePath, wizard, aData);
        await foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, basePath, authToken);
        return new SetupData(authToken, await getFolderMyId(authToken, url));
    // }
}

async function setupParallel(){
    for(let i in instances.instances){
        let url = instPath(instances.instances[i].url);
        const wizard = wizardData(instances.instances[i].email, instances.instances[i].password);
        const authdata = authData(instances.instances[i].email, instances.instances[i].password);
        let authToken = await auth(url, wizard, authdata);
        if(instances.instances[i].port) {
            instances.instances[i].url = instPath(`${instances.instances[i].url}:${instances.instances[i].port}`)
        }
        else {
            instances.instances[i].url = instPath(`${instances.instances[i].url}`);
        }
        await foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, instances.instances[i].url, authToken);
        instances.instances[i].idMy = await getFolderMyId(authToken, instances.instances[i].url);
    }
    return instances;
}
