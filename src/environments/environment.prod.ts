export const environment = {
  production: true,
  projectName: "Core",
  serverApiUrl: "http://localhost:8080/services/appscoreapi/api/",
  appUrl: "http://localhost:4200",
  defaultDataSource: 'appscoreapi',
  keycloak: {
    url: "https://auth.ccc.net/auth",
    realm: 'Apps',
    clientId: 'frontend',
    scope: 'openid profile email',
  },
  appconfig: {
    url: "http://localhost:8080/appconfig/api/v1/users"
  }
};
