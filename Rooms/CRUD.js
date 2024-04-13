import http from 'k6/http';
import { check, group } from 'k6';
import { rooms } from '../config/params.js';
import faker  from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import { addTagsDefault } from '../config/scenarios.js';

export function createRoom(params, trend, environment){
    const roomTitle = faker.random.words();
    const payload = JSON.stringify({
        Title: roomTitle,
        RoomType: 6,
    });

    let URL = rooms;
    const res = http.post(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Create new room'),
    });
    check(res, {'Cretion room status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
    return res.json().response.id;
}

export function getRoomInfo(id, params, trend, environment){
    let URL = `${rooms}/${id}`;
    const res = http.get(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get room info'),
    });
    check(res, {'Get room info status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function renameRoom(id, params, trend, environment){
    const roomTitle = faker.random.words();
    const payload = JSON.stringify({
        Title: roomTitle,
    });
    let URL = `${rooms}/${id}`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Rename room'),
    });
    check(res, {'Rename room status': res => res.status === 200});
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function removeRoom(id, params, trend, environment){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms}/${id}`;
    const res = http.del(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Remove room'),
    });
    check(res, { 'Room delete status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function archiveRoom(id, params, trend, environment){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms}/${id}/archive`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Archive room'),
    });
    check(res, { 'Room archive status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unarchiveRoom(id, params, trend, environment){
    const payload = JSON.stringify({
        DeleteAfter: false,
    });
    let URL = `${rooms}/${id}/unarchive`;
    const res = http.put(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Unarchive room'),
    });
    check(res, { 'Room unarchive status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function pinRoom(id, params, trend, environment){
    let URL = `${rooms}/${id}/pin`;
    const res = http.put(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Pin room'),
    });
    check(res, { 'Room pin status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function unpinRoom(id, params, trend, environment){
    let URL = `${rooms}/${id}/unpin`;
    const res = http.put(URL, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Unpin room'),
    });
    check(res, { 'Room unpin status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function getRoomAcessRights(id, params, trend, environment){
    const payload = JSON.stringify({
        "filterType": null,
    });
    let URL = `${rooms}/${id}/share`;
    const res = http.get(URL, payload, {
        headers: params.headers, 
        tags: addTagsDefault(true, 'Get room acess rights'),
    });
    check(res, { 'Get room acess rights status': res => res.status === 200 });
    trend[environment].add(res.timings.duration, { url: res.request.url, status: res.status, method: res.request.method,});
}

export function RoomCRUD(params, trend, environment) {
    let folderId = null;

    group('Create new room', () => {
        folderId = createRoom(params, trend, environment);
    });

    group('Get room info', () => {
        getRoomInfo(folderId, params, trend, environment);
    });

    group('Rename room', () => {
        renameRoom(folderId, params, trend, environment);
    });

    group('Archive room', () =>{
        archiveRoom(folderId, params, trend, environment);
    })

    group('Unarchive room', () => {
        unarchiveRoom(folderId, params, trend, environment);
    })

    group('Remove room', () => {
        removeRoom(folderId, params, trend, environment);
    });

};