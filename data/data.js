import http from 'k6/http';
import faker  from 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js';
import { basePath, setParams } from '../config/params.js';

export function foldersAndFiles(countFolders, countFiles, typeFolder, auth){
    let params = setParams(auth);
    
    const res = http.get(typeFolder, params);
    const id = res.json().response.current.id;
    let arrayFiles =[];
    let arrayFolders = [];
    if(countFolders){
        for(let i = 0; i < countFolders; i++)
        {
            const folderTitle = faker.random.word();
            const payload = JSON.stringify({
                title:	folderTitle,
            });
            let URL = `${basePath}files/folder/${id}`;
            const res = http.post(URL, payload, params);
            arrayFolders.push(res.json().response.id);
        }
    }
    if(countFiles){
        for(let i = 0; i < countFiles; i++)
        {
            const fileTitle = faker.system.commonFileName('docx');
            const payload = JSON.stringify({
                title:	fileTitle,
                EnableExternalExt: true,
            });
            let URL = `${basePath}files/${id}/file`;
            const res = http.post(URL, payload, params);
            arrayFiles.push(res.json().response.id);
        }
    }
    return { arrayFiles, arrayFolders };
};

