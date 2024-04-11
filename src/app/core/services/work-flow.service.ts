import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, Subject, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiQuery } from '../miscellaneous/api-query.template';
import { ApiURL } from '../miscellaneous/api.template';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';

@Injectable({ providedIn: 'root' })

export class WorkFlowService {
    baseURL = environment.serverApiUrl;
    constructor(
        private http: HttpClient,
        private utilitiesService: UtilitiesService,
        private apiService: ApiService
    ) { }

    getProjects() {
        return this.http.get(this.baseURL + ApiURL.projects);
    }
    getProject() {

        return this.http.get(this.baseURL + ApiURL.projects + '/1');
    }

    getAllWorkFlowTemplates() {
        return this.http.get(this.baseURL + ApiURL.workflow_templates);
    }

    AddWorkFlowStep(data) {
        return this.http.post(this.baseURL + ApiURL.workflow_templates, data);
    }

    EditWorkFlowTemplate(id, data) {
        return this.http.patch(this.baseURL + ApiURL.workflow_templates + '/' + id, data);
    }

    AddWorkFlowTemplate(data) {
        return this.http.post(this.baseURL + ApiURL.workflow_templates, data);
    }

    getDetailById(id) {
        return this.http.get(this.baseURL + ApiURL.details + '/' + id);
    }

    addFormDetails(data) {
        return this.http.post(this.baseURL + ApiURL.details, data);
    }

}
