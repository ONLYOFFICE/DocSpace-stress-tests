import {
    AuthData,
    WizardData
} from './params';
import {
    AuthenticationApi,
    Configuration,
    CommonSettingsApi,
    SettingsDto
} from '@onlyoffice/docspace-api-typescript-k6';


export function auth(basePath: string, wizardData?: WizardData | undefined, authData?: AuthData | undefined) {
    
    const configuration = new Configuration({basePath: basePath});
    const commonSettingsApi = new CommonSettingsApi(configuration);

  let res;
  try {
    res = commonSettingsApi.getPortalSettings(true);
  } catch (error) {
    throw new Error(`Failed to get portal settings from ${basePath}: ${error}`);
  }

  let response: SettingsDto | undefined = res.data.response;
  
  if (response?.wizardToken && wizardData) {
      const completeWizard = commonSettingsApi.completeWizard({
          email: wizardData.Email,
          passwordHash: wizardData.PasswordHash
      }, {
          headers: {
              'Content-Type': 'application/json',
              'confirm': `${response.wizardToken}`
          }
      })
      
      const cookieName = 'asc_auth_key';

      return (completeWizard.headers['set-cookie'] as string[])
          .find(cookie => cookie.includes(cookieName))
          ?.match(new RegExp(`^${cookieName}=(.+?);`))
          ?.[1];
  }

  const authenticationApi = new AuthenticationApi(configuration);
  const authResult = authenticationApi.authenticateMe({
      password: authData?.Password,
      userName: authData?.UserName
  });
    
  if (authResult.status === 200) {
    return  authResult.data.response?.token;
  }
  return undefined;
}
