import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SessionStorageService, LocalStorageService } from "ngx-webstorage";
import { environment } from "src/environments/environment";
import { ApiURL } from "../miscellaneous/api.template";
import { SecurityAction } from "../models/security-model/security-action.model";
import { SecurityEntity } from "../models/security-model/security-entity.model";

@Injectable({ providedIn: 'root' })

export class SecurityService {
  baseURL = environment.serverApiUrl;

  constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService) { }

  getPermissionsByUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.baseURL}${ApiURL.security_permissions}/user/${userId}`)
        .pipe().subscribe((res) => {
          if (Object.keys(res).length > 0) {
            resolve(res)
          }
          else
            resolve(null)
        },
          () => resolve(null))
    });
  }

  getUserIdByEmail(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.baseURL}${ApiURL.appusers}?email.equals=${userId}`)
        .pipe().subscribe((res) => {
          if (Object.keys(res).length > 0) {
            resolve(res)
          }
          else
            resolve(null)
        },
          () => resolve(null))
    });
  }

  getPermissions(): any {
    return this.localStorageService.retrieve('PERMISSIONS') == null ? this.sessionStorageService.retrieve('PERMISSIONS') : this.localStorageService.retrieve('PERMISSIONS');
  }

  setPermissions(permissions) {
    this.sessionStorageService.store('PERMISSIONS', permissions)
  }

  hasPermissions(entities: SecurityEntity[], security_action: SecurityAction) {
    let permissions = this.getPermissions()
    let hasPermission = false
    entities.forEach(entity => {
      let action = permissions ? permissions[entity.toString()] : null
      if (this.hasPermission(security_action, action))
        hasPermission = true;
    })
    return hasPermission
  }

  private hasPermission(security_action: SecurityAction, action: string) {
    if (security_action == SecurityAction.read)
      return action == SecurityAction.read.toString() || action == SecurityAction.create.toString() || action == SecurityAction.manage.toString()
    else if (security_action == SecurityAction.create)
      return action == SecurityAction.create.toString() || action == SecurityAction.manage.toString()
    else return action == SecurityAction.manage.toString()

  }
  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.sessionStorageService.clear();
        this.localStorageService.clear();
        resolve();
      }, 100);
    });
  }


}