import { Injectable } from "@angular/core";
import { ApiURL } from './../miscellaneous/api.template';
import { environment } from "src/environments/environment";

import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class previewService {
    baseURL = environment.serverApiUrl;
    
    constructor(private http: HttpClient) { }

  getjasperReport(format: String, id) {
    return this.http.get(this.baseURL + ApiURL.transmittalreport + "/" + format + "/" + id, {
      responseType: 'blob' as 'json'
    })
  }

}