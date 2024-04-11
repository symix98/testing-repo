import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Account } from 'src/app/core/models/account.model';
import { DataViewParameter } from 'src/app/core/models/data-view-model/dataview-parameter.model';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
  loggedInUserAccount: Account;
  userEmail: string;

  dataViewParam: DataViewParameter;
  Tabs: number = 0;

  constructor(private router: Router, private utilitiesService: UtilitiesService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loggedInUserAccount = this.utilitiesService.getLoggedinAccount();
    if (this.loggedInUserAccount) {
      this.userEmail = this.loggedInUserAccount.email;
    }
    this.initDataViewParams();
  }

  handleChange($event) {
    this.Tabs = $event.index;
    this.initDataViewParams();
  }

  initDataViewParams() {
    let param: DataViewParameter = new DataViewParameter();


    param.onRowSelected = this.onRowSelected;
    param.paginator = true;
    param.rowPerPageDefault = 10;
    param.sortOrder = -1; // for descending
    param.defaultFilter = this.getFiltersMap();

    this.dataViewParam = param;
  }


  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.getSelection().type != 'Range') {
        const param = {
          formId: event.id
        };
  
        resolve();
      }
    });
  }

  getFiltersMap() {
    let map: Map<string, any> = new Map();
    if (this.Tabs === 0) {
      map.set('createdById', this.userEmail);
    }
    else if (this.Tabs === 1) {
      map.set('createdById', this.userEmail);
    }
  
    return map;
  }

}
