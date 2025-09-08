import http from 'k6/http';
import {WizardData, AuthData} from './params';
import {
    SettingsCommonSettingsApi,
    AuthenticationApi,
    FilesFoldersApi,
    FilesOperationsApi,
    Configuration
} from '@onlyoffice/docspace-api-typescript';
import {
    SettingsDto
} from "@onlyoffice/docspace-api-typescript/models/settings-dto";


export async function auth(basePath: string, wizardData?: WizardData | undefined, authData?: AuthData | undefined) {
    const configuration = new Configuration({basePath: basePath});
    const commonSettingsApi = new SettingsCommonSettingsApi(configuration);
  let res = await commonSettingsApi.getSettings(true);
  let response: SettingsDto | undefined = res.data.response;
  
  if (response?.wizardToken && wizardData) {
      const completeWizard = await commonSettingsApi.completeWizard({
          email: wizardData.Email,
          passwordHash: wizardData.PasswordHash
      }, {
          headers: {
              'Content-Type': 'application/json',
              'confirm': `${response.wizardToken}`
          }
      })

      return completeWizard.headers["set-cookie"];//?.find({value: "asc_auth_key"});
  }

  const authenticationApi = new AuthenticationApi(configuration);
  const authResult = await authenticationApi.authenticateMe({
      password: authData?.Password,
      userName: authData?.UserName
  });
    
  if (authResult.status === 200) {
    return  authResult.data.response?.token;
  }
  return undefined;
}
