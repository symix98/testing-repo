import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { FilterType } from '../../shared/table-template/modules/table-filter.module';
import { TableIconComponent } from '../../shared/table-template/compnents/table-icon/table-icon.component';
import { TableRowMenuComponent } from '../../shared/table-template/compnents/table-row-menu/table-row-menu.component';

@Component({
  selector: 'app-filter-result',
  templateUrl: './filter-result.component.html',
  styleUrls: ['./filter-result.component.scss']
})
export class FilterResultComponent implements OnInit, OnChanges {
  tableParam: TableParameter;
  showDocHistory: boolean = false;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    let query: string = ""

    if (changes.data && this.data) {
      //create shearch function 
      let savedFilter: any = JSON.parse(sessionStorage.getItem('searchQueryEdit'));

      const keys = Object.keys(savedFilter);
      keys.forEach(key => {
        const value = savedFilter[key];

        if (value && key != 'queriesh') {
          if (/,/.test(value)) {
            query += key + '.in=' + value + '&'
          } else if (key == 'revisionDate' || key == 'receiveDate' || key == 'replyRequiredBy' || 
                     key == 'repliedDate' || key == 'dateModified' || key == 'lastModifiedDate' ||
                     key == 'plannedSubmissionDate') {
            let newDate: any
            newDate = this.formatDate(value) + "T21:00:00.000Z"

            query += key + '.equals=' + newDate + '&'
          } else {
            query += key + '.contains=' + value + '&'
          }
        }
      });

      if (query.length > 0) {
        query = query.slice(0, -1);
      }

      // refresh the table 
      this.tableParam = null
      setTimeout(() => {
        this.initTableParam(query)
      }, 10);
    }
  }

  ngOnInit(): void {
    this.initTableParam('')
  }

  @Input() data: any
  async initTableParam(query) {
    let param: TableParameter = new TableParameter();
    if (query) { query = "&" + query }

    if (this.showDocHistory) {
      param.api = ApiURL.documentss + "?fileType.notEquals=FOLDER&" + "path.contains=Production&" + query
    } else {
      // param.api = ApiURL.documentss + "?fileType.notEquals=FOLDER&" + "path.contains=Production&" + "projectField1.notEquals=history" + query
      param.api = ApiURL.documentss + "?fileType.notEquals=FOLDER&" + "path.contains=Production&" + query
    }

    // param.defaultFilter = new Map<any, any>([['fileType', '']])
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.mulitple
    param.showToggler = false
    // param.scrollHeight = "30vh"
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
    //  param.buttons = this.initTableButtons();
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Document', field: 'documentsNumber', fieldType: FieldType.component, specialColumn: TableIconComponent, filter: { filterType: FilterType.string, filterName: 'documentsNumber' } },
        { title: '', field: '', fieldType: FieldType.component1, specialColumn: TableRowMenuComponent, disableSort: true },
        { title: 'Title', field: 'title', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'title' } },
        { title: 'Discipline', field: 'disciplines', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'disciplines' } },
        { title: 'Status', field: 'sstatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'sstatus' } },
        { title: 'Revision', field: 'revision', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'revision' } },
        { title: 'Version', field: 'version', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'version' } },
        { title: 'Phase', field: 'phase', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'phase' } },
        { title: 'File Type', field: 'fileType', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'fileType' } },
        { title: 'Revision Date', field: 'revisionDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'revisionDate' } },
        { title: 'Class', field: 'classes', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'classes' } },
        { title: 'Documents For', field: 'documentsFor', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'documentsFor' } },
        { title: 'Initiated By', field: 'initiatedBy', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'initiatedBy' } },
        { title: 'Receive Date', field: 'receiveDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'receiveDate' } },
        { title: 'Reply Required', field: 'replyRequired', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'replyRequired' } },
        { title: 'Reply Required By', field: 'replyRequiredBy', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'replyRequiredBy' } },
        { title: 'Replied Date', field: 'repliedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'repliedDate' } },
        { title: 'TQ Status', field: 'tqStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'tqStatus' } },
        { title: 'Path', field: 'path', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'path' } },
        { title: 'Work Flow', field: 'workflow', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'workflow' } },
        { title: 'Current Step', field: 'currentStep', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'currentStep' } },
        { title: 'Ssize', field: 'ssize', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'ssize' } },
        { title: 'Transmitted', field: 'isTransmitted', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'isTransmitted' } },
        { title: 'Confidential', field: 'confidential', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'confidential' } },
        { title: 'Additional Reference', field: 'additionalReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'additionalReference' } },
        { title: 'Review Status', field: 'reviewStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewStatus' } },
        { title: 'Model Reference', field: 'modelReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'modelReference' } },
        { title: 'Created By', field: 'createdBy', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'createdBy' } },
        { title: 'Date Modified', field: 'dateModified', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'dateModified' } },
        { title: 'Related Items', field: 'relatedItems', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'relatedItems' } },
        { title: 'Access Level', field: 'accessLevel', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'accessLevel' } },
        { title: 'Csi Spec Code', field: 'csiSpecCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'csiSpecCode' } },
        { title: 'Current', field: 'current', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'current' } },
        { title: 'Facility Code', field: 'facilityCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'facilityCode' } },
        { title: 'File Name', field: 'fileName', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'fileName' } },
        { title: 'Forecast Subm To Client', field: 'forecastSubmToClient', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'forecastSubmToClient' } },
        { title: 'Job Number', field: 'jobNumber', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'jobNumber' } },
        { title: 'Lock', field: 'lock', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'lock' } },
        { title: 'Last Modified Date', field: 'lastModifiedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'lastModifiedDate' } },
        { title: 'Milestone', field: 'milestone', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'milestone' } },
        { title: 'No Of Markups', field: 'numberOfMarkups', fieldType: FieldType.number, filter: { filterType: FilterType.number, filterName: 'numberOfMarkups' } },
        { title: 'Activity Id', field: 'activityId', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'activityId' } },
        { title: 'Planned Submit Date', field: 'plannedSubmissionDate', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'plannedSubmissionDate' } },
        { title: 'Print Size', field: 'printSize', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'printSize' } },
        { title: 'Purchase Order', field: 'purchaseOrder', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'purchaseOrder' } },
        { title: 'Remarks', field: 'remarks', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'remarks' } },
        { title: 'Review Source', field: 'reviewSource', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewSource' } },
        // { title: 'Project Field1', field: 'projectField1', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField1' } },
        // { title: 'Project Field2', field: 'projectField2', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField2' } },
        // { title: 'Project Field3', field: 'projectField3', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField3' } },
        // { title: 'Project Field4', field: 'projectField4', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField4' } },
        // { title: 'Project Field5', field: 'projectField5', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField5' } },
        // { title: 'Project Field6', field: 'projectField6', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField6' } },
        // { title: 'Project Field7', field: 'projectField7', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'projectField7' } },
      ];
    return tableColumns;
  }


  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      // let parm = {
      //   id: event.selected.id,
      // }
      // this.router.navigate(['support-fabrication/mto/mto-form', parm])
      // this.dialogRef.close(event)
      resolve();
    });
  }

  showDocumentHistory() {
    // this.tableParam = null
    // setTimeout(() => {
    //   this.initTableParam('')
    // }, 10);
  }

  formatDate(dateString: string): string {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    let month = '' + (dateObject.getMonth() + 1);
    let day = '' + dateObject.getDate();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
