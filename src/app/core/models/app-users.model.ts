import { AppUserRole } from './app-user-role.model';

export class AppUsers {
    userId?: string;
    name?: string;
    isAdministrator?: boolean;
    inactive?: boolean
    email?: string;
    appUserRoles?: AppUserRole[];
    siteEngineer?: string;
    shopId?: string;
    roles?: AppUserRole[];
}
