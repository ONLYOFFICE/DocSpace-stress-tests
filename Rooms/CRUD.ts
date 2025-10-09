import { check, group } from 'k6';
import { instPath, instances, basePath, path } from '../config/params';
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

export function createRoom(authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new RoomsApi(configuration);
    //var tags = addTagsDefault(false, 'Create new room', `${path}files/rooms`),
    const res = apiInstance.createRoom({title: faker.word.words(), roomType: 6});
    
    check(res, {'Cretion room status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
    return res.data.response?.id;
}

export function getRoomInfo(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new RoomsApi(configuration);
    //var tags =addTagsDefault(false, 'Get room info', `${path}files/rooms/{id}`),
    const res = apiInstance.getRoomInfo(id);
    check(res, {'Get room info status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function renameRoom(id: number | undefined, authToken: string,trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({accessToken: authToken, basePath: basePath});
    const apiInstance = new RoomsApi(configuration);
    
    //addTagsDefault(false, 'Rename room', `${path}files/rooms/{id}`),
    const roomTitle = faker.word.words();
    const res = apiInstance.updateRoom(id, {title: roomTitle});
    check(res, {'Rename room status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function removeRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    //addTagsDefault(false, 'Remove room', `${path}files/rooms/{id}`),

    const res = apiInstance.deleteRoom(id, {deleteAfter: false});
    check(res, {'Room delete status': res => res.status === 200});
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function archiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    //var tags = addTagsDefault(false, 'Archive room', `${path}files/rooms/{id}/archive`),
    const res = apiInstance.archiveRoom(id, {deleteAfter: false});
    check(res, { 'Room archive status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unarchiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string){
    if(!id)
    {
        return;
    }
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    // addTagsDefault(false, 'Unarchive room', `${path}files/rooms/{id}/unarchive`),
    const res = apiInstance.unarchiveRoom(id, { deleteAfter: false });
    check(res, { 'Room unarchive status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function pinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    //addTagsDefault(false, 'Pin room', `${path}files/rooms/{id}/pin`)
    const res = apiInstance.pinRoom(id);
    check(res, { 'Room pin status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unpinRoom(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    //addTagsDefault(false, 'Unpin room', `${path}files/rooms/{id}/unpin`)
    const res = apiInstance.unpinRoom(id);
    check(res, { 'Room unpin status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function getRoomAcessRights(id: number, authToken: string, trend: Metrics, environment: string, basePath: string){
    const configuration = new Configuration({ accessToken: authToken, basePath: basePath });
    const apiInstance = new RoomsApi(configuration);
    
    //addTagsDefault(false, 'Get room acess rights', `${path}files/rooms/{id}/share`)
    const res = apiInstance.getRoomSecurityInfo(id);
    check(res, { 'Get room acess rights status': res => res.status === 200 });
    //trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function RoomCRUD(authToken: string, trend: Metrics, environment: string, basePath: string) {
    let folderId: number | undefined;

    group('Create new room', () => {
        folderId = createRoom(authToken, trend, environment, basePath);
    });

    group('Get room info', () => {
        getRoomInfo(folderId, authToken, trend, environment, basePath);
    });

    group('Rename room', () => {
       renameRoom(folderId, authToken, trend, environment, basePath);
    });

    group('Archive room', () =>{
        archiveRoom(folderId, authToken, trend, environment, basePath);
    })

    group('Unarchive room', () => {
        unarchiveRoom(folderId, authToken, trend, environment, basePath);
    })

    group('Remove room', () => {
        removeRoom(folderId, authToken, trend, environment, basePath);
    });

}

export function setupFunc(){
    // let data = {};
    // if(instances.parallel === true|| instances.parallel === "true") {
    //     data = setupParallel();
    //     return data;
    // }
    // else {
        return auth(basePath);
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
