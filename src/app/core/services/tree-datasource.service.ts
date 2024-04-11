import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe, Subject, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';


@Injectable({ providedIn: 'root' })
export class TreeDataSourceService {
  selectedNode = new Subject<any>();
  isClosedNewFileDialog = new Subject<any>()
  filesToUpload = new Subject<any>()
  refreshTable = new Subject<any>()
  
  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService,
    private apiService: ApiService
  ) {}

}
