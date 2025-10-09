import { faker } from '@faker-js/faker';
import {
    Configuration,
    FilesApi,
    FoldersApi
} from '@onlyoffice/docspace-api-typescript-k6';

export function foldersAndFiles(
  countFolders: number | undefined,
  countFiles: number | undefined,
  basePath: string,
  auth?: string | null | undefined
) {
    if(!auth) {
        return { arrayFiles: [], arrayFolders: [] };
    }
    const configuration = new Configuration({accessToken: auth, basePath: basePath});
    const foldersApi = new FoldersApi(configuration);
    const filesApi = new FilesApi(configuration);
    const myFolderId = (foldersApi.getMyFolder()).data.response?.current?.id;
    const arrayFiles: number[] = [];
    const arrayFolders: number[] = [];

    if(!myFolderId){
        return { arrayFiles, arrayFolders };
    }
    
  if (countFolders) {
    for (let i = 0; i < countFolders; i++) {
        const createFolderResponse = foldersApi.createFolder(myFolderId, {
            title: faker.word.words(),
        });
        const folderId = createFolderResponse.data.response?.id;
        if(folderId){
            arrayFolders.push(folderId);
        }
    }
  }

  if (countFiles) {
    for (let i = 0; i < countFiles; i++) {
        const fileTitle = faker.system.commonFileName('docx');
        const createFileResponse = filesApi.createFile(myFolderId, {title: fileTitle, enableExternalExt: true});
        const fileId = createFileResponse.data.response?.id;
        if(fileId) {
            arrayFiles.push(fileId);
        }
    }
  }

  return { arrayFiles, arrayFolders };
}
