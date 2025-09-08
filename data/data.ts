import { faker } from '@faker-js/faker';
import {
    Configuration,
    FilesFilesApi,
    FilesFoldersApi
} from "@onlyoffice/docspace-api-typescript";

export async function foldersAndFiles(
  countFolders: number | undefined,
  countFiles: number | undefined,
  basePath: string,
  auth?: string
) {
    const configuration = new Configuration({apiKey: auth, basePath: basePath});
    const foldersApi = new FilesFoldersApi(configuration);
    const filesApi = new FilesFilesApi(configuration);
    const myFolderId = (await foldersApi.getMyFolder()).data.response?.current?.id;
    const arrayFiles: number[] = [];
    const arrayFolders: number[] = [];

    if(!myFolderId){
        return { arrayFiles, arrayFolders };
    }
    
  if (countFolders) {
    for (let i = 0; i < countFolders; i++) {
        const createFolderResponse = await foldersApi.createFolder(myFolderId, {
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
        const createFileResponse = await filesApi.createFile(myFolderId, {title: fileTitle, enableExternalExt: true});
        const fileId = createFileResponse.data.response?.id;
        if(fileId) {
            arrayFiles.push(fileId);
        }
    }
  }

  return { arrayFiles, arrayFolders };
}
