import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilterquerySaveComponent } from '../filterquery-save/filterquery-save.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { FilterPropertyComponent } from '../filter-property/filter-property.component';
import { Account } from 'src/app/core/models/account.model';
import { UtilitiesService } from 'src/app/core/services/utilities.service';


interface Filter {
  id: number,
  queryName: string,
  queryDesc: string,
  isPrivate: boolean,
  isActive: true
}


@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})

export class UserFilterComponent implements OnInit {
  @Output() onFilterSelect = new EventEmitter<any>()

  // loggedInUserAccount: Account;
  currentUser: any;
  userEmail: string;

  products: any[];
  userFilter: Filter[] = [];
  userPublicFilter: Filter[] = [];
  selectedItem: any;
  querySelected: number;

  searchQueryForm: any = {
    id: null,
    documentsNumber: null,
    revision: null,
    revisionDate: null,
    version: null,
    fileType: null,
    title: null,
    phase: null,
    classes: null,
    documentsFor: null,
    initiatedBy: null,
    disciplines: null,
    receiveDate: null,
    replyRequired: false,
    replyRequiredBy: null,
    repliedDate: null,
    tqStatus: null,
    path: null,
    workflow: null,
    currentStep: null,
    ssize: null,
    isTransmitted: null,
    sstatus: null,
    confidential: null,
    additionalReference: null,
    reviewStatus: null,
    modelReference: null,
    createdBy: null,
    dateModified: null,
    relatedItems: null,
    accessLevel: null,
    csiSpecCode: null,
    current: null,
    facilityCode: null,
    fileName: null,
    forecastSubmToClient: null,
    jobNumber: null,
    lock: null,
    lastModifiedDate: null,
    milestone: null,
    numberOfMarkups: null,
    activityId: null,
    plannedSubmissionDate: null,
    printSize: null,
    purchaseOrder: null,
    reviewSource: null,
    projectField1: null,
    projectField2: null,
    projectField3: null,
    projectField4: null,
    projectField5: null,
    projectField6: null,
    projectField7: null,
    queriesh: { id: null }
  };

  constructor(private dialogService: DialogService,
    private ApiService: ApiService,
    private utilitiesService: UtilitiesService) {
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    this.getFilterQueries();
    this.getFilterPublicQueries();

    // this.loggedInUserAccount = this.utilitiesService.getLoggedinAccount();
    // if (this.loggedInUserAccount) {
    //   this.userEmail = this.loggedInUserAccount.email;
    // }
  }

  getFilterQueries() {
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['isPrivate', true], ['createdBy', this.currentUser.name]])
    query.size = 10000;
    this.ApiService.get(ApiURL.querieshes, query).subscribe((res) => {
      if (res) {
        this.userFilter = res;
      }
    })
  }

  getFilterPublicQueries() {
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['isPrivate', false]])
    query.size = 10000;
    this.ApiService.get(ApiURL.querieshes, query).subscribe((res) => {
      if (res) {
        this.userPublicFilter = res;
      }
    })
  }

  onIconClick(i: number, event: any) {
    localStorage.removeItem('querieshId')

    this.dialogService.open(FilterquerySaveComponent, {
      data: event,
      header: "Update Search Query",
      width: "500px"
    }).onClose.subscribe(res => {
      if (res) {
        this.getFilterQueries()
        this.getFilterPublicQueries()
        // this.querySelected = this.userFilter.findIndex(item => item['queryName'] == event.queryName)
        // this.userFilter[this.querySelected].queryName = res.queryName
        // this.userFilter[this.querySelected].queryDesc = res.queryDesc
        // this.userFilter[this.querySelected].isPrivate = res.isPrivate
        // this.userFilter[this.querySelected].isActive = res.isActive
      }
    })
  }

  onEditPublicFilter(i: number, event: any) {
    localStorage.removeItem('querieshId')

    this.dialogService.open(FilterquerySaveComponent, {
      data: event,
      header: "Update Search Query",
      width: "500px"
    }).onClose.subscribe(res => {
      if (res) {
        this.getFilterQueries()
        this.getFilterPublicQueries()
      }
    })
  }

  getSearchQueryDetails(event: any) {
    // sessionStorage.removeItem("searchQueryEdit")

    localStorage.setItem('querieshId', event.value[0].id)
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['querieshId', event.value[0].id]])
    query.size = 10000;

    this.ApiService.get(ApiURL.queriesds, query).subscribe((res) => {
      if (res) {
        for (const key of Object.keys(this.searchQueryForm)) {
          if (this.searchQueryForm.hasOwnProperty(key)) {
            this.searchQueryForm[key] = "";
          }
        }

        for (const key of Object.keys(res)) {
          let fieldName: string = res[key].parameterName;
          let fieldValue: any = ""
          if (fieldName == "revisionDate" || fieldName == "receiveDate" || 
              fieldName == "replyRequiredBy" || fieldName == "repliedDate" || 
              fieldName == "dateModified" || fieldName == "forecastSubmToClient" || 
              fieldName == "lastModifiedDate" || 
              fieldName == "plannedSubmissionDate") {

            fieldValue = new Date(res[key].parameterValue);
          } else {
            fieldValue = res[key].parameterValue;
          }


          if (this.searchQueryForm.hasOwnProperty([fieldName])) {
            this.searchQueryForm[fieldName] = fieldValue;
          }
        }
        // sessionStorage.setItem("searchQueryEdit", JSON.stringify(this.searchQueryForm));
        this.onFilterSelect.emit(this.searchQueryForm)
      }
    })
  }

}
