import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { UserFilterComponent } from '../user-filter/user-filter.component';
import { FilterPropertyComponent } from '../filter-property/filter-property.component';
import { Account } from 'src/app/core/models/account.model';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';


// interface query {
//   queryName?: string;
//   queryDesc?: string;
//   isPrivate?: boolean;
//   createdby?: string;
// }


@Component({
  selector: 'app-filterquery-save',
  templateUrl: './filterquery-save.component.html',
  styleUrls: ['./filterquery-save.component.scss']
})
export class FilterquerySaveComponent implements OnInit {
  // @ViewChild(UserFilterComponent) userFilterComponent: UserFilterComponent;
  @Output() recordSaved = new EventEmitter();


  currentUser: any;

  submitted: boolean = false;
  isUpdate: boolean = false;

  buttonName: string = "Save"
  buttonIcon: string = "pi pi-save"
  id: number = 0;

  stateOptions: any[];

  documentQuery: any = {
    id: null,
    queryName: null,
    queryDesc: null,
    isPrivate: true,
    isActive: true,
    createdBy: null,
    creationDate: null
  };

  searchQueryForm: any = {
    id: null,
    parameterName: '',
    parameterValue: '',
    isMultiple: false,
    sortField1: null,
    sortField2: null,
    sortField3: null,
    sortField4: null,
    queriesh: { id: null }
  };

  savedQueryForm: any[] = [];

  constructor(private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private ApiService: ApiService,
    private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    this.stateOptions = [{ label: 'Private Query', value: true }, { label: 'Public Query', value: false }];

    if (this.dynamicDialogConfig.data) {
      if (this.dynamicDialogConfig.data.id) {
        this.id = this.dynamicDialogConfig.data.id
        this.documentQuery.id = this.dynamicDialogConfig.data.id;
        this.documentQuery.queryName = this.dynamicDialogConfig.data.queryName
        this.documentQuery.queryDesc = this.dynamicDialogConfig.data.queryDesc
        this.documentQuery.isPrivate = this.dynamicDialogConfig.data.isPrivate
        this.documentQuery.isActive = this.dynamicDialogConfig.data.isActive
        this.documentQuery.createdBy = this.dynamicDialogConfig.data.createdBy

        this.isUpdate = true
        this.buttonName = "Update"
        this.buttonIcon = "pi pi-check"
      } else {
        let query: ApiQuery = new ApiQuery();
        query.filter = new Map<any, any>([['id', localStorage.getItem('querieshId')]])

        this.ApiService.get(ApiURL.querieshes, query).subscribe(res => {
          if (res) {
            this.id = res[0].id
            this.documentQuery.id = res[0].id;
            this.documentQuery.queryName = res[0].queryName
            this.documentQuery.queryDesc = res[0].queryDesc
            this.documentQuery.isPrivate = res[0].isPrivate
            this.documentQuery.isActive = res[0].isActive
            this.documentQuery.createdBy = res[0].createdBy

            this.isUpdate = true
            this.buttonName = "Update"
            this.buttonIcon = "pi pi-check"
          }
        }, (err) => {
          this.utilitiesService.notifyError(err.error.title);
        });
      }

    }
  }

  async saveFilterQuery() {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();

    if (this.isUpdate) {
      this.documentQuery.createdBy = this.currentUser.name,
        this.ApiService.put(ApiURL.querieshes + "/" + this.id, this.documentQuery).subscribe(res => {
          if (res) {
            //edit details table
            setTimeout(async () => {
              this.searchQueryForm = JSON.parse(sessionStorage.getItem('searchQuery'));
              this.savedQueryForm = JSON.parse(sessionStorage.getItem('savedQuery'));

              for (let i = 0; i < this.searchQueryForm.length; i++) {
                if (this.searchQueryForm[i].status == "ADD") {

                  this.searchQueryForm[i]['queriesh']['id'] = res.id;

                  this.ApiService.post(ApiURL.queriesds, this.searchQueryForm[i]).subscribe(res => {
                  }, (err) => {
                    this.utilitiesService.notifyError(err.error.title);
                  });
                } else if (this.searchQueryForm[i].status == "UPDATE") {
                  this.searchQueryForm[i]['queriesh']['id'] = res.id;

                  this.ApiService.put(ApiURL.queriesds + "/" + this.searchQueryForm[i].id, this.searchQueryForm[i]).subscribe(resDet => {
                  }, (err) => {
                    this.utilitiesService.notifyError(err.error.title);
                  });
                }
              }

              for (let i = 0; i < this.savedQueryForm.length; i++) {
                if (this.savedQueryForm[i].status == "DELETE") {
                  this.ApiService.delete(ApiURL.queriesds + "/" + this.savedQueryForm[i].id).subscribe(res => {
                  }, (err) => {
                    this.utilitiesService.notifyError(err.error.title);
                  });
                }

              }
            }, 50);
            this.utilitiesService.notifySuccess("Search Query Updated!")
            // sessionStorage.removeItem('searchQuery');
            // sessionStorage.removeItem('savedQuery');
            // localStorage.removeItem('querieshId')
            this.dialogRef.close(res);
          }
        }, (err) => {
          this.utilitiesService.notifyError(err.error.title)
        })

    } else {
      // let currentdate = new Date()
      this.searchQueryForm = JSON.parse(sessionStorage.getItem('searchQuery'));

      let docFilter = {
        queryName: this.documentQuery.queryName,
        queryDesc: this.documentQuery.queryDesc,
        isActive: this.documentQuery.isActive,
        isPrivate: this.documentQuery.isPrivate,
        createdBy: this.currentUser.name,
        creationDate: new Date()
      }

      this.ApiService.post(ApiURL.querieshes, docFilter).subscribe(async res => {
        if (res) {
          setTimeout(async () => {
            for (let i = 0; i < this.searchQueryForm.length; i++) {
              this.searchQueryForm[i]['queriesh']['id'] = res.id;

              this.ApiService.post(ApiURL.queriesds, this.searchQueryForm[i]).subscribe(resDet => {

              }, (err) => {
                this.utilitiesService.notifyError(err.error.title);
              });
            }
          }, 50);

          // sessionStorage.removeItem('searchQuery');
          // sessionStorage.removeItem('savedQuery');
          // localStorage.removeItem('querieshId')
          
          this.dialogRef.close(res);
          this.utilitiesService.notifySuccess("Search Query Saved!")
        }
      }, (err) => {
        this.utilitiesService.notifyError(err.error.title)
      })
    }

    // sessionStorage.removeItem('searchQuery');
    // sessionStorage.removeItem('savedQuery');
    localStorage.removeItem('querieshId')
  }


  // documentForm(document_number: any, documentForm: any) {
  //   throw new Error('Method not implemented.');
  // }

  closeForm() {
    this.dialogRef.close();
  }

}
