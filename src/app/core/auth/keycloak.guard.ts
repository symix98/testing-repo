import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { SecurityAction } from '../models/security-model/security-action.model';
import { SecurityService } from '../services/security.service';
import { UtilitiesService } from '../services/utilities.service';


@Injectable({
    providedIn: 'root',
})
export class KeycloakGuard extends KeycloakAuthGuard {

    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService,
        private utilities: UtilitiesService,
        private securityService: SecurityService) {
        super(router, keycloak);
    }

    public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            await this.keycloak.login({
                redirectUri: window.location.origin + state.url,
                scope: environment.keycloak.scope
            });
        }
        // return true;
        // Uncomment this code when backend runs
        //----------------------------------------
        const profile = await this.keycloak.loadUserProfile();
        const dataSource = await this.utilities.handleAccountDatasource(profile);
        const userId = await this.securityService.getUserIdByEmail(profile.email);
        if(userId){
            const permissions = await this.securityService.getPermissionsByUser(userId[0].userId);
        // //console.log(permissions)
        if (dataSource && permissions) {
            this.utilities.setLoggedinAccount(profile);
            this.securityService.setPermissions(permissions);
        }
        else {
           this.router.navigate(['access']);
        }
        return !dataSource || !permissions ? false : true;
        }else{
            this.router.navigate(['access']);
        }
        //----------------------------------------
    }

    public canLoad(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return new Promise((resolve, reject) => {
            let data = route.data
            if (data?.entity) {
                 let hasPermission = this.securityService.hasPermissions(route.data.entity, SecurityAction.read);
                if (!hasPermission)
                    this.router.navigate(['access']);
                resolve(hasPermission)
            } else resolve(true)
        });
    }
 
}
