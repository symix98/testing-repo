import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { ApiURL } from '../miscellaneous/api.template';
import { AppUsers } from '../models/app-users.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppUserService {
    constructor(private http: HttpClient) { }
    baseURL = environment.serverApiUrl;

    findByRole(roleId: string): Observable<AppUsers[]> {
        if (roleId)
            return this.http.get<AppUsers[]>(`${this.baseURL}${ApiURL.appusers}/byRole/${roleId}`)
                .pipe(map(response => { return response; }));
    }

    getAppUserDetails(): Observable<AppUsers[]> {
        return this.http.get<AppUsers[]>(`${this.baseURL}${ApiURL.appusers}`)
            .pipe(map(response => { return response; }));
    }
}

export enum AppUserRoles {
    engineering = "Engineering",
    fab_shop = "Fab Shop",
    Subcontractor = "Subcontractor",
    site_engineer = "Site Engineer",
    workface_planner = "Workface Planner",
    administrator = "Administrator",
    constraint_coordinate = "Constraint Coordinator",
    supervisor = "Supervisor",
    inspector = "Inspector",
    welding_foreman = "Welding Foreman",
    qc_inspector = "QC Inspector",
    foreman = "Foreman",
    construction_engineer = "Construction Engineer",
    contractor_inspector = "Contractor Inspector",
    company_inspector = "Company Inspector",
    ndt_subcontractor = "NDT SubContractor",
}
