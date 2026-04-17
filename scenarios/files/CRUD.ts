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
    FilesApi,
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

export async function createFile(id: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FilesApi(configuration);
    const fileTitle = faker.system.commonFileName('docx');
    const res = await apiInstance.createFile({
        folderId: id,
        createFileJsonElement: { title: fileTitle, enableExternalExt: true }
    });
    let result: number | undefined = 0;
    if (check(res, { 'Creation file status': res => res.status === 200 })) {
        result = res.data.response?.id;
    }
    return result;
}

export async function getFile(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.getFileInfo({ fileId: id });
    check(res, { 'Get file info status': res => res.status === 200 });
    return res;
}

export async function updateFile(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const fileTitle = faker.system.commonFileName('docx');
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.updateFile({
        fileId: id,
        updateFile: { title: fileTitle }
    });
    check(res, { 'Update file status': res => res.status === 200 });
}

export async function deleteFile(id: number | undefined, authToken: string, trend: Metrics | null, environment: string | null, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new FilesApi(configuration);
    const res = await apiInstance.deleteFile({
        fileId: id,
        _delete: { deleteAfter: false, immediately: true }
    });
    check(res, { 'File delete status': res => res.status === 200 });
}

export async function FileCRUD(idMy: number, authToken: string, trend: Metrics, environment: string, basePath: string) {
    let fileid: number | undefined;
    fileid = await group('Create file', () => createFile(idMy, authToken, trend, environment, basePath));
    await group('Get file info', () => getFile(fileid, authToken, trend, environment, basePath));
    await group('Update file title', () => updateFile(fileid, authToken, trend, environment, basePath));
    await group('Delete file', () => deleteFile(fileid, authToken, trend, environment, basePath));
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
