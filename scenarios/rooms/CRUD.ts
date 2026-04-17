import { check, group } from 'k6';
import { basePath, authData, wizardData } from '../../config/params';
import { faker } from '@faker-js/faker';
import { auth } from '../../config/auth';
import {
    RoomsApi,
    Configuration
} from '@onlyoffice/docspace-api-typescript-k6';
import { Metrics } from '../../config/metrics';

function makeConfig(authToken: string, basePath: string): Configuration {
    return new Configuration({
        accessToken: authToken,
        basePath: basePath,
        baseOptions: { headers: { 'Authorization': `Bearer ${authToken}` } }
    });
}

export async function createRoom(authToken: string, trend: Metrics, environment: string, basePath: string) {
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.createRoom({
        createRoomRequestDto: { title: faker.word.words(), roomType: 6 }
    });
    check(res, { 'Cretion room status': res => res.status === 200 });
    return res.data.response?.id;
}

export async function getRoomInfo(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.getRoomInfo({ id });
    check(res, { 'Get room info status': res => res.status === 200 });
}

export async function renameRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const roomTitle = faker.word.words();
    const res = await apiInstance.updateRoom({ id, updateRoomRequest: { title: roomTitle } });
    check(res, { 'Rename room status': res => res.status === 200 });
}

export async function removeRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.deleteRoom({ id, deleteRoomRequest: { deleteAfter: false } });
    check(res, { 'Room delete status': res => res.status === 200 });
}

export async function archiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.archiveRoom({ id, archiveRoomRequest: { deleteAfter: false } });
    check(res, { 'Room archive status': res => res.status === 200 });
}

export async function unarchiveRoom(id: number | undefined, authToken: string, trend: Metrics, environment: string, basePath: string) {
    if (!id) {
        return;
    }
    const configuration = makeConfig(authToken, basePath);
    const apiInstance = new RoomsApi(configuration);
    const res = await apiInstance.unarchiveRoom({ id, archiveRoomRequest: { deleteAfter: false } });
    check(res, { 'Room unarchive status': res => res.status === 200 });
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

export async function setupFunc() {
    const wizard = wizardData();
    const aData = authData();
    return await auth(basePath, wizard, aData);
}
