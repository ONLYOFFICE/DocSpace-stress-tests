import { check, group } from 'k6';
import { instPath, instances, basePath } from '../config/params';
import { faker } from '@faker-js/faker';
//import { addTagsDefault } from '../config/scenarios';
import { auth } from '../config/auth';

import {
    RoomsApi,
    FoldersApi,
    OperationsApi,
    Configuration
} from '@onlyoffice/docspace-api-typescript-k6';
import {
    Metrics
} from "../config/metrics";

function makeConfig(authToken: string, basePath: string): Configuration {
    return new Configuration({
        accessToken: authToken,
        basePath: basePath,
        baseOptions: { headers: { 'Authorization': `Bearer ${authToken}` } }
    });
}

export async function createRoom(authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.createRoom({
        createRoomRequestDto: { title: faker.word.words(), roomType: 6 }
    });

    check(res, {'Cretion room status': res => res.status === 200});
    return res.data.response?.id;
}

export async function getRoomInfo(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.getRoomInfo({ id });
    check(res, {'Get room info status': res => res.status === 200});
}

export async function renameRoom(id: number | undefined, authToken: string,trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);

    const roomTitle = faker.word.words();
    const res = await apiInstance.updateRoom({ id, updateRoomRequest: { title: roomTitle } });
    check(res, {'Rename room status': res => res.status === 200});
}

export async function removeRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if(!id)
    {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);

    const res = await apiInstance.deleteRoom({ id, deleteRoomRequest: { deleteAfter: false } });
    check(res, {'Room delete status': res => res.status === 200});
}

export async function archiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.archiveRoom({ id, archiveRoomRequest: { deleteAfter: false } });
    check(res, { 'Room archive status': res => res.status === 200 });
}

export async function unarchiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.unarchiveRoom({ id, archiveRoomRequest: { deleteAfter: false } });
    check(res, { 'Room unarchive status': res => res.status === 200 });
}

export async function pinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.pinRoom({ id });
    check(res, { 'Room pin status': res => res.status === 200 });
}

export async function unpinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.unpinRoom({ id });
    check(res, { 'Room unpin status': res => res.status === 200 });
}

export async function getRoomAcessRights(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);

    const res = await apiInstance.getRoomSecurityInfo({ id });
    check(res, { 'Get room acess rights status': res => res.status === 200 });
}

export async function RoomCRUD(authToken: string, trend: Metrics, environment: string, basePath: string) {
    let folderId: number | undefined;

    folderId = await group('Create new room', () => createRoom(authToken, trend, environment, basePath));
    await group('Get room info', () => getRoomInfo(folderId, authToken, trend, environment, basePath));
    await group('Rename room', () => renameRoom(folderId, authToken, trend, environment, basePath));
    await group('Archive room', () => archiveRoom(folderId, authToken, trend, environment, basePath));
    await group('Unarchive room', () => unarchiveRoom(folderId, authToken, trend, environment, basePath));
    await group('Remove room', () => removeRoom(folderId, authToken, trend, environment, basePath));
}

export async function setupFunc(){
    // let data = {};
    // if(instances.parallel === true|| instances.parallel === "true") {
    //     data = setupParallel();
    //     return data;
    // }
    // else {
        return await auth(basePath);
    // }
}

// async function setupParallel() {
//     for (const i in instances.instances) {
//         let url = instPath(instances.instances[i].url);
//         let authToken = await auth(url);
//         if (instances.instances[i].port) {
//             instances.instances[i].url = instPath(`${instances.instances[i].url}:${instances.instances[i].port}`)
//         } else {
//             instances.instances[i].url = instPath(`${instances.instances[i].url}`);
//         }
//         instances.instances[i].params = setParams(authToken);
//     }
//     return instances;
// }
