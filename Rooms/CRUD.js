import http from 'k6/http';
import { check, group } from 'k6';
import { rooms, instPath, instances, basePath, setParams } from '../config/params.js';
import faker  from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import { addTagsDefault } from '../config/scenarios.js';
import { auth } from '../config/auth.js';

export function createRoom(params, trend, environment, url){
    const roomTitle = faker.random.words();
    const payload = JSON.stringify({
        Title: roomTitle,
        RoomType: 6,
    });

    let URL = rooms(url);
    const res = http.post(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Create new room'),
    });
    check(res, {'Cretion room status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
    return res.json().response.id;
}

export function getRoomInfo(id, params, trend, environment, url){
    let URL = `${rooms(url)}/${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get room info'),
    });
    check(res, {'Get room info status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function renameRoom(id, params, trend, environment, url){
    const roomTitle = faker.random.words();
    const payload = JSON.stringify({
        Title: roomTitle,
    });
    let URL = `${rooms(url)}/${id}`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Rename room'),
    });
    check(res, {'Rename room status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function removeRoom(id, params, trend, environment, url){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms(url)}/${id}`;
    const res = http.del(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Remove room'),
    });
    check(res, { 'Room delete status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function archiveRoom(id, params, trend, environment, url){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms(url)}/${id}/archive`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Archive room'),
    });
    check(res, { 'Room archive status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unarchiveRoom(id, params, trend, environment, url){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms(url)}/${id}/unarchive`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Unarchive room'),
    });
    check(res, { 'Room unarchive status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function pinRoom(id, params, trend, environment, url){
    let URL = `${rooms(url)}/${id}/pin`;
    const res = http.put(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Pin room'),
    });
    check(res, { 'Room pin status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unpinRoom(id, params, trend, environment, url){
    let URL = `${rooms(url)}/${id}/unpin`;
    const res = http.put(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Unpin room'),
    });
    check(res, { 'Room unpin status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function getRoomAcessRights(id, params, trend, environment, url){
    const payload = JSON.stringify({
        "filterType": null,
    });
    let URL = `${rooms(url)}/${id}/share`;
    const res = http.get(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get room acess rights'),
    });
    check(res, { 'Get room acess rights status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function RoomCRUD(params, trend, environment, url) {
    let folderId = null;

    group('Create new room', () => {
        folderId = createRoom(params, trend, environment, url);
    });

    group('Get room info', () => {
        getRoomInfo(folderId, params, trend, environment, url);
    });

    group('Rename room', () => {
        renameRoom(folderId, params, trend, environment, url);
    });

    group('Archive room', () =>{
        archiveRoom(folderId, params, trend, environment, url);
    })

    group('Unarchive room', () => {
        unarchiveRoom(folderId, params, trend, environment, url);
    })

    group('Remove room', () => {
        removeRoom(folderId, params, trend, environment, url);
    });

};

export function setupFunc(){
    let data = {};
    if(instances.parallel === true|| instances.parallel === "true") {
        data = setupParallel();
        return data;
    }
    else {
        var authToken = auth(basePath);
        data.params = setParams(authToken);
        return data;
    }
}

function setupParallel(){
    for(var i in instances.instances){
        let url = instPath(instances.instances[i].url);
        let authToken = auth(url);
        if(instances.instances[i].port) {
            instances.instances[i].url = instPath(`${instances.instances[i].url}:${instances.instances[i].port}`)
        }
        else {
        instances.instances[i].url = instPath(`${instances.instances[i].url}`);
        }
        instances.instances[i].params = setParams(authToken);
    }
    return instances;
}