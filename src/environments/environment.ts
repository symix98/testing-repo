// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  projectName: "Core",
  serverApiUrl: "http://localhost:8081/api/",
  appUrl: "http://localhost:4200",
  defaultDataSource: 'storageserverApi',
  keycloak: {
    url: "https://keycloakrnd.ccc.net/auth",
    realm: 'AppsRND',
    clientId: 'frontend',
    scope: 'openid profile email',
  },
  appconfig: {
    url: "http://localhost:8080/appconfig/api/v1/users"
  }
};

/*
url: "https://auth.ccc.net/auth",
    realm: 'Apps',
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
