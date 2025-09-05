
import http from 'k6/http';
import { faker } from '@faker-js/faker';
import { basePath, setParams } from '../config/params';

export type FoldersAndFilesResult = {
  arrayFiles: string[];
  arrayFolders: string[];
};

export function foldersAndFiles(
  countFolders: number | undefined,
  countFiles: number | undefined,
  typeFolder: string,
  auth?: string
): FoldersAndFilesResult {
  const params = setParams(auth as any);

  const res = http.get(typeFolder, params as any);
  const id = (res.json() as any).response.current.id as string;
  const arrayFiles: string[] = [];
  const arrayFolders: string[] = [];

  if (countFolders) {
    for (let i = 0; i < countFolders; i++) {
      const folderTitle = faker.word.words();
      const payload = JSON.stringify({
        title: folderTitle,
      });
      const URL = `${basePath}files/folder/${id}`;
      const res = http.post(URL, payload, params as any);
      arrayFolders.push((res.json() as any).response.id as string);
    }
  }

  if (countFiles) {
    for (let i = 0; i < countFiles; i++) {
      const fileTitle = faker.system.commonFileName('docx');
      const payload = JSON.stringify({
        title: fileTitle,
        EnableExternalExt: true,
      });
      const URL = `${basePath}files/${id}/file`;
      const res = http.post(URL, payload, params as any);
      arrayFiles.push((res.json() as any).response.id as string);
    }
  }

  return { arrayFiles, arrayFolders };
}
