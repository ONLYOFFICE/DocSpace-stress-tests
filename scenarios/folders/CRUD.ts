import { check, group } from 'k6';
import { faker } from '@faker-js/faker';
import {
    authData,
    basePath,
    filesCountFolderMy,
    foldersCountFolderMy,
    url,
    wizardData
} from '../../config/params';
import { foldersAndFiles } from '../../data/data';
import { auth } from '../../config/auth';
import {
    Configuration,
    FoldersApi,
    OperationsApi
} from '@onlyoffice/docspace-api-typescript-k6';
import { Metrics } from '../../config/metrics';

function makeConfig(authToken: string, basePath: string): Configuration {
    return new Configuration({
        accessToken: authToken,
        basePath: basePath,
        baseOptions: { headers: { 'Authorization': `Bearer ${authToken}` } }
    });
}

export async function getFolderMyId(authToken: string | null | undefined, basePath: string) {
    if (!authToken) {
        return 0;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.getMyFolder();
    let id: number | undefined = undefined;
    if (check(res, { 'Get folderMy': res => res.status === 200 })) {
        id = res.data.response?.current?.id;
    }
    return id;
}

export async function createFolder(id: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.createFolder({
        folderId: id,
        createFolder: { title: faker.word.words() }
    });
    let result: number | undefined;
    if (check(res, { 'Creation folder status': res => res.status === 200 }, { property: 'Create folder' })) {
        result = res.data.response?.id;
    }
    return result;
}

export async function getFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.getFolder({ folderId: id });
    check(res, { 'Get folder info status': res => res.status === 200 }, { property: 'Get folder info' });
}

export async function updateFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.renameFolder({
        folderId: id,
        createFolder: { title: faker.word.words() }
    });
    check(res, { 'Update folder status': res => res.status === 200 }, { property: 'Update folder title' });
}

export async function deleteFolder(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FoldersApi(configuration);
    const res = await apiInstance.deleteFolder({
        folderId: id,
        deleteFolder: { deleteAfter: false, immediately: true }
    });
    check(res, { 'Folder delete status': res => res.status === 200 }, { property: 'Delete folder' });
}

export async function FolderCRUD(idMy: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
    let folderId: number | undefined;
    folderId = await group('Create folder', () => createFolder(idMy, authToken, trend, environment, basePath));
    await group('Get folder info', () => getFolder(folderId, authToken, trend, environment, basePath));
    await group('Update folder title', () => updateFolder(folderId, authToken, trend, environment, basePath));
    await group('Delete folder', () => deleteFolder(folderId, authToken, trend, environment, basePath));
}

export async function emptyTrash(authToken: string, basePath: string) {
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new OperationsApi(configuration);
    const res = await apiInstance.emptyTrash();
    check(res, { 'Empty trash status': res => res.status === 200 });
}

export class SetupData {
    authToken: string | null | undefined;
    idMy: number | undefined;
    constructor(authToken: string | null | undefined, idMy: number | undefined) {
        this.authToken = authToken;
        this.idMy = idMy;
    }
}

export async function setupFunc() {
    const wizard = wizardData();
    const aData = authData();
    const authToken = await auth(basePath, wizard, aData);
    await foldersAndFiles(foldersCountFolderMy, filesCountFolderMy, basePath, authToken);
    return new SetupData(authToken, await getFolderMyId(authToken, url));
}
