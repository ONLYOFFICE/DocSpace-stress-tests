import { check, group } from 'k6';
import { instPath, instances, basePath, path } from '../config/params';
import { faker } from '@faker-js/faker';
//import { addTagsDefault } from '../config/scenarios';
import { auth } from '../config/auth';

import {
    FilesRoomsApi,
    FilesFoldersApi,
    FilesOperationsApi,
    Configuration
} from '@onlyoffice/docspace-api-typescript';
import {
    Metrics
} from "../config/metrics";

export async function createRoom(authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesRoomsApi(configuration);
    //var tags = addTagsDefault(false, 'Create new room', `${path}files/rooms`),
    const res = await apiInstance.createRoom({title: faker.word.words(), roomType: 6});
    
    check(res, {'Cretion room status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
    return res.data.response?.id;
}

export async function getRoomInfo(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesRoomsApi(configuration);
    //var tags =addTagsDefault(false, 'Get room info', `${path}files/rooms/{id}`),
    const res = await apiInstance.getRoomInfo(id);
    check(res, {'Get room info status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function renameRoom(id: number | undefined, authToken: string,trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({apiKey: authToken, basePath: basePath});
    const apiInstance = new FilesRoomsApi(configuration);
    
    //addTagsDefault(false, 'Rename room', `${path}files/rooms/{id}`),
    const roomTitle = faker.word.words();
    const res = await apiInstance.updateRoom(id, {title: roomTitle});
    check(res, {'Rename room status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function removeRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    //addTagsDefault(false, 'Remove room', `${path}files/rooms/{id}`),

    const res = await apiInstance.deleteRoom(id, {deleteAfter: false});
    check(res, {'Room delete status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function archiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    //var tags = addTagsDefault(false, 'Archive room', `${path}files/rooms/{id}/archive`),
    const res = await apiInstance.archiveRoom(id, {deleteAfter: false});
    check(res, { 'Room archive status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function unarchiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    // addTagsDefault(false, 'Unarchive room', `${path}files/rooms/{id}/unarchive`),
    const res = await apiInstance.unarchiveRoom(id, { deleteAfter: false });
    check(res, { 'Room unarchive status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function pinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    //addTagsDefault(false, 'Pin room', `${path}files/rooms/{id}/pin`)
    const res = await apiInstance.pinRoom(id);
    check(res, { 'Room pin status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function unpinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    //addTagsDefault(false, 'Unpin room', `${path}files/rooms/{id}/unpin`)
    const res = await apiInstance.unpinRoom(id);
    check(res, { 'Room unpin status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function getRoomAcessRights(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ apiKey: authToken, basePath: basePath });
    const apiInstance = new FilesRoomsApi(configuration);
    
    //addTagsDefault(false, 'Get room acess rights', `${path}files/rooms/{id}/share`)
    const res = await apiInstance.getRoomSecurityInfo(id);
    check(res, { 'Get room acess rights status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export async function RoomCRUD(authToken: string, trend: Metrics, environment: string, basePath: string) {
    let folderId: number | undefined;

    await group('Create new room', async () => {
        folderId = await createRoom(authToken, trend, environment, basePath);
    });

    await group('Get room info', async () => {
        await getRoomInfo(folderId, authToken, trend, environment, basePath);
    });

    await group('Rename room', async () => {
       await renameRoom(folderId, authToken, trend, environment, basePath);
    });

    await group('Archive room', async () =>{
        await archiveRoom(folderId, authToken, trend, environment, basePath);
    })

    await group('Unarchive room', async () => {
        await unarchiveRoom(folderId, authToken, trend, environment, basePath);
    })

    await group('Remove room', async () => {
        await removeRoom(folderId, authToken, trend, environment, basePath);
    });

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
