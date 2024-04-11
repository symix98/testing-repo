import { AfterContentChecked, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, NgModel } from '@angular/forms';
import { FilterquerySaveComponent } from '../filterquery-save/filterquery-save.component';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ApiService } from 'src/app/core/services/api.service';
import { UserFilterComponent } from '../user-filter/user-filter.component';
import { UtilitiesService } from 'src/app/core/services/utilities.service';



interface FilterFields {
  name: string,
  filedname: string,
  selected: boolean
}

// interface docTypes {
//   name: string,
//   code: string
// }

interface docFileTypes {
  name: string,
  code: string
}

@Component({
  selector: 'app-filter-property',
  templateUrl: './filter-property.component.html',
  styleUrls: ['./filter-property.component.scss']
})

export class FilterPropertyComponent implements OnInit, OnChanges, DoCheck, AfterContentChecked {
  @ViewChildren(NgModel) ngModels: QueryList<NgModel>;
  @Input() data: any
  @Output() onSearchClicked = new EventEmitter<any>()

  previousObjectState: any;

  // querySearchForm: FormGroup;

  // searchValueForm: any = {
  //   id: null,
  //   parameterName: '',
  //   parameterValue: '',
  //   isMultiple: false,
  //   sortField1: null,
  //   sortField2: null,
  //   sortField3: null,
  //   sortField4: null,
  //   queriesh: { id: null }
  // };

  searchQueryForm: any = {
    id: null,
    documentsNumber: null,
    title: null,
    type: null,
    disciplines: null,
    sstatus: null,
    revision: null,
    revisionDate: null,
    version: null,
    phase: null,
    fileType: null,
    classes: null,
    documentsFor: null,
    initiatedBy: null,
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
    remarks: null,
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

  showMoreFilter: boolean = false;
  sourceFilters: FilterFields[] = [];
  targetFilters: FilterFields[] = [];

  // docTypeList: docTypes[];
  // selecteddocTypeList: docTypes[];

  fileTypeList: any[];
  selectedFileType: any[] = [];
  statusList: any[] = [];
  isUpdate: boolean = false;
  searchQuery: any[] = []
  savedQuery: any[] = []


  showExtraFilters: boolean = false
  image: { h: string, w: string } = { h: '150', w: '200' };

  constructor(private dialogService: DialogService,
    private ApiService: ApiService,
    private utilitiesService: UtilitiesService,
    private cdref: ChangeDetectorRef) { }

  ngDoCheck(): void {
    if (this.previousObjectState !== this.searchQueryForm) {
      // console.log('myObject changed:', this.searchQueryForm);
      this.previousObjectState = this.searchQueryForm;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.selectedFileType = [];
    this.targetFilters = [];

    if (changes.data && this.data) {
      this.searchQueryForm = this.data
      
      if (this.data.fileType) { this.selectedFileType = this.data.fileType.split(',')  } 

      //load extra filters by default
      for (const key of Object.keys(this.data)) {
        if (this.data[key]) {
          for (let i = 0; i < this.sourceFilters.length; i++) {
            if (this.sourceFilters[i].filedname == key) {
              this.showExtraFilters = true;

              this.targetFilters.push(this.sourceFilters[i])
            }
          }

          for (let i = 0; i < this.targetFilters.length; i++) {
            this.targetFilters[i].selected = true;
          }
        }
      }

      this.isUpdate = true;
    }
  }


  ngOnInit(): void {
    setTimeout(async () => {
      this.getFileTypesReference();
    }, 10);


    // this.querySearchForm = this.formBuilder.group({
    //   documentNumber: [''],
    //   title: [''],
    //   doctype: ['']
    // });

    this.statusList = [
      { label: 'YES', value: 'YES' },
      { label: 'NO', value: 'NO' },
    ];

    // this.fileTypeList = [
    //   { name: 'Pdf', code: 'PDF' },
    //   { name: 'Excel', code: 'Excel' },
    //   { name: 'Word', code: 'Word' },
    //   { name: 'Image', code: 'Image' }
    // ];

    this.sourceFilters = [
      { name: 'Classes', filedname: 'classes', selected: false },
      { name: 'Revision Date', filedname: 'revisionDate', selected: false },
      { name: 'Documents For', filedname: 'documentsFor', selected: false },
      { name: 'Initiated By', filedname: 'initiatedBy', selected: false },
      { name: 'Receive Date', filedname: 'receiveDate', selected: false },
      { name: 'Reply Required', filedname: 'replyRequired', selected: false },
      { name: 'Reply Required By', filedname: 'replyRequiredBy', selected: false },
      { name: 'Replied Date', filedname: 'repliedDate', selected: false },
      { name: 'TQ Status', filedname: 'tqStatus', selected: false },
      { name: 'Path', filedname: 'path', selected: false },
      { name: 'Work Flow', filedname: 'workflow', selected: false },
      { name: 'Current Step', filedname: 'currentStep', selected: false },
      { name: 'Ssize', filedname: 'ssize', selected: false },
      { name: 'Transmitted', filedname: 'isTransmitted', selected: false },
      { name: 'Confidential', filedname: 'confidential', selected: false },
      { name: 'Additional Reference', filedname: 'additionalReference', selected: false },
      { name: 'Review Status', filedname: 'reviewStatus', selected: false },
      { name: 'Model Reference', filedname: 'modelReference', selected: false },
      { name: 'Created By', filedname: 'createdBy', selected: false },
      { name: 'Date Modified', filedname: 'dateModified', selected: false },
      { name: 'Related Items', filedname: 'relatedItems', selected: false },
      { name: 'Access Level', filedname: 'accessLevel', selected: false },
      { name: 'Csi Spec Code', filedname: 'csiSpecCode', selected: false },
      { name: 'Current', filedname: 'current', selected: false },
      { name: 'Facility Code', filedname: 'facilityCode', selected: false },
      { name: 'File Name', filedname: 'fileName', selected: false },
      { name: 'Forecast Subm To Client', filedname: 'forecastSubmToClient', selected: false },
      { name: 'Job Number', filedname: 'jobNumber', selected: false },
      { name: 'Lock', filedname: 'lock', selected: false },
      { name: 'Last Modified Date', filedname: 'lastModifiedDate', selected: false },
      { name: 'Milestone', filedname: 'milestone', selected: false },
      { name: 'No Of Markups', filedname: 'numberOfMarkups', selected: false },
      { name: 'Activity Id', filedname: 'activityId', selected: false },
      { name: 'Planned Submit Date', filedname: 'plannedSubmissionDate', selected: false },
      { name: 'Print Size', filedname: 'printSize', selected: false },
      { name: 'Purchase Order', filedname: 'purchaseOrder', selected: false },
      { name: 'Remarks', filedname: 'remarks', selected: false },
      { name: 'Review Source', filedname: 'reviewSource', selected: false },
      // { name: 'Project Field1', filedname: 'projectField1', selected: false },
      // { name: 'Project Field2', filedname: 'projectField2', selected: false },
      // { name: 'Project Field3', filedname: 'projectField3', selected: false },
      // { name: 'Project Field4', filedname: 'projectField4', selected: false },
      // { name: 'Project Field5', filedname: 'projectField5', selected: false },
      // { name: 'Project Field6', filedname: 'projectField6', selected: false },
      // { name: 'Project Field7', filedname: 'projectField7', selected: false },
    ];

    // this.searchQueryForm = JSON.parse(sessionStorage.getItem('searchQueryEdit'));
  }


  ngAfterContentChecked() {
    this.cdref.detectChanges();

    // if (this.previousObjectState !== this.searchQueryForm) {
    //   this.previousObjectState = this.searchQueryForm;
    // }
  }

  getFileTypesReference() {
    this.ApiService.get(ApiURL.files_types).subscribe(res => {
      if (res) {
        this.fileTypeList = res
      }
    }, (err) => {
      this.utilitiesService.notifyError("Error")
    })
  }

  addMoreFilter() {
    this.showMoreFilter = true;
  }

  applySelectedFilter() {
    for (let i = 0; i < this.targetFilters.length; i++) {
      this.targetFilters[i].selected = true;
    }
    this.showMoreFilter = false;
  }

  closeFilterForm() {
    if (this.targetFilters.length) {
      this.showExtraFilters = true;
    } else {
      this.showExtraFilters = false;
    }
    this.showMoreFilter = false;

  }

  isValueInArray(value: string): boolean {
    for (let i = 0; i < this.targetFilters.length; i++) {
      if (this.targetFilters[i].name == value) {
    
        return true;
      }
    }
    return false;
  }

  async addFilterQuery() {
    await this.saveFilterQuery();

    this.dialogService.open(FilterquerySaveComponent, {
      header: "Add Search Query",
      width: "500px"
    }).onClose.subscribe(res => {
      if (res) {
        this.isUpdate = false;
        this.searchQueryForm = [];
        // this.clearFields();
      }
    })
  }


  async EditFilterQuery() {
    await this.saveFilterQuery();
    await this.getSavedFilterQuery();

    setTimeout(() => {
      for (var i = 0; i < this.savedQuery.length; i++) {
        for (var j = 0; j < this.searchQuery.length; j++) {
          if (this.savedQuery[i].parameterName == this.searchQuery[j].parameterName) {
            this.savedQuery[i].status = "FOUND"
          }

          if ((this.savedQuery[i].parameterName == this.searchQuery[j].parameterName) &&
            (this.savedQuery[i].parameterValue != this.searchQuery[j].parameterValue)) {
            this.searchQuery[j].status = "UPDATE"
            this.searchQuery[j].id = this.savedQuery[i].id

          } else if ((this.savedQuery[i].parameterName == this.searchQuery[j].parameterName) &&
            (this.savedQuery[i].parameterValue == this.searchQuery[j].parameterValue)) {
            this.searchQuery[j].status = ""
          }
        }
      }

      sessionStorage.setItem("searchQuery", JSON.stringify(this.searchQuery));
      sessionStorage.setItem("savedQuery", JSON.stringify(this.savedQuery));
    }, 30);  

    this.dialogService.open(FilterquerySaveComponent, {
      data: event,
      header: "Add Search Query",
      width: "500px"
    }).onClose.subscribe(res => {
      if (res) {
        this.isUpdate = false;
        this.searchQueryForm = [];
        // this.clearFields();
      }
    })
  }

  searchDocuments() {
    sessionStorage.setItem("searchQueryEdit", JSON.stringify(this.searchQueryForm));
    this.onSearchClicked.emit(this.searchQueryForm)
  }

  async saveFilterQuery() {
    // let searchQuery: any[] = []
    this.searchQuery = [];
    let searchValue: any;
    let isMultiple: boolean;

    this.ngModels.forEach(ngModel => {
      searchValue = ngModel.value
      isMultiple = false;

      if (ngModel.name == 'fileType') {
        let filetype = "";
        for (let i = 0; i < this.selectedFileType.length; i++) {
          filetype += this.selectedFileType[i] + ","
        }
        searchValue = filetype.substring(0, filetype.length - 1);
        isMultiple = true;
      } 
      // else if (ngModel.name == 'replyRequired') {
      //   searchValue = ngModel.value
      // }

      if (searchValue) {
        this.searchQuery.push({
          id: null,
          parameterName: ngModel.name,
          parameterValue: searchValue,
          isMultiple: isMultiple,
          status: 'ADD',
          queriesh: { id: null }
        });
      }
    });

    sessionStorage.setItem("searchQuery", JSON.stringify(this.searchQuery));
  }

  async getSavedFilterQuery() {
    this.savedQuery = [];
    let query: ApiQuery = new ApiQuery();
    query.filter = new Map<any, any>([['querieshId', localStorage.getItem('querieshId')]])

    this.ApiService.get(ApiURL.queriesds, query).subscribe(res => {
      if (res) {
        for (var i = 0; i < res.length; i++) {
          this.savedQuery.push({
            id: res[i].id,
            parameterName: res[i].parameterName,
            parameterValue: res[i].parameterValue,
            isMultiple: res[i].isMultiple,
            status: 'DELETE',
            queriesh: { id: localStorage.getItem('querieshId') }
          });
        }
      }
    }, (err) => {
      this.utilitiesService.notifyError(err.error.title);
    });

    
    // this.isUpdate = false;
    // this.searchQueryForm = [];
  }

  async clearFields() {
    this.isUpdate = false;
    this.searchQueryForm = [];
    sessionStorage.removeItem('searchQuery');
    sessionStorage.removeItem('savedQuery');
    localStorage.removeItem('querieshId')
    this.showExtraFilters = false;
    // this.showMoreFilter = false;
  }


  // getSearchQuery_Details(id: any) {
  //   // this.searchQueryForm = [];
  //   let query: ApiQuery = new ApiQuery();
  //   query.filter = new Map<any, any>([['querieshId', id]])
  //   query.size = 10000;

  //   this.ApiService.get(ApiURL.queriesds, query).subscribe((res) => {
  //     if (res) {
  //       for (const key of Object.keys(res)) {
  //         let fieldName: string = res[key].parameterName;
  //         let fieldValue: string = res[key].parameterValue;

  //         if (this.searchQueryForm.hasOwnProperty([fieldName])) {
  //           this.searchQueryForm[fieldName] = fieldValue;
  //         }
  //       }
  //     }
  //   })
  // }
}
