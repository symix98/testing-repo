import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TableIconComponent } from 'src/app/pages/shared/table-template/compnents/table-icon/table-icon.component';
import { TableRowMenuComponent } from 'src/app/pages/shared/table-template/compnents/table-row-menu/table-row-menu.component';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';

@Component({
  selector: 'app-shared-doc-preview',
  templateUrl: './shared-doc-preview.component.html',
  styleUrls: ['./shared-doc-preview.component.scss']
})
export class SharedDocPreviewComponent implements OnInit {

  linkId:string
  hyperlinkDt :any
  tableParam: TableParameter;
  constructor(
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdref: ChangeDetectorRef,
    private activatedRouteService: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.linkId = this.activatedRouteService.snapshot.paramMap.get("id");
    let query :ApiQuery = new ApiQuery()
    query.filter = new Map<any,any>([['linkId',this.linkId]])
    this.apiService.get(ApiURL.hyberlinks,query).subscribe(res =>{
      this.hyperlinkDt = res[0]
      this.initTableParam(res[0]?.id)
    })
  }

  async initTableParam(hyberLinkId) {
    let param: TableParameter = new TableParameter();
    param.api = ApiURL.documentss
    param.defaultFilter = new Map<any, any>([['hyberLinkId', hyberLinkId]])
    param.dataKey = 'id'
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.single
    param.showToggler = false
    param.scrollHeight = "65vh"
    param.onRowSelected = this.onRowSelected
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'document', field: 'documentsNumber', fieldType: FieldType.component, width: '20%', specialColumn: TableIconComponent, filter: { filterType: FilterType.string, filterName: 'documentsNumber' } },
        { title: '', field: '', fieldType: FieldType.component1, width: 'auto', specialColumn: TableRowMenuComponent, disableSort: true },
        { title: 'Title', field: 'title', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'title' } },
        { title: 'Status', field: 'sstatus', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'sstatus' } },
        // { title: 'Version', field: 'version', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'version' } },
        { title: 'Revision', field: 'revision', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'revision' } },
        { title: 'Revision Date', field: 'revisionDate', fieldType: FieldType.date, width: '10%', filter: { filterType: FilterType.date_default, filterName: 'revisionDate' } },
        { title: 'File Type', field: 'fileType', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'fileType' } },
        { title: 'Created By', field: 'createdBy', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'createdBy' } },
        { title: 'Modified Date', field: 'dateModified', fieldType: FieldType.date, width: '15%', filter: { filterType: FilterType.date_default, filterName: 'dateModified' } },
        { title: 'File Size', field: 'ssize', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'ssize' } },
        { title: 'Discipline', field: 'disciplines', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'disciplines' }, isHide: true },
        { title: 'Phase', field: 'phase', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'phase' }, isHide: true },
        { title: 'Class', field: 'classes', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'classes' }, isHide: true },
        { title: 'Documents For', field: 'documentsFor', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'documentsFor' }, isHide: true },
        { title: 'Initiated By', field: 'initiatedBy', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'initiatedBy' }, isHide: true },
        { title: 'Receive Date', field: 'receiveDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'receiveDate' }, isHide: true },
        { title: 'Reply Required', field: 'replyRequired', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'replyRequired' }, isHide: true },
        { title: 'Reply Required By', field: 'replyRequiredBy', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'replyRequiredBy' }, isHide: true },
        { title: 'Replied Date', field: 'repliedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'repliedDate' }, isHide: true },
        { title: 'TQ Status', field: 'tqStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'tqStatus' }, isHide: true },
        { title: 'Path', field: 'path', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'path' }, isHide: true },
        { title: 'Work Flow', field: 'workflow', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'workflow' }, isHide: true },
        { title: 'Current Step', field: 'currentStep', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'currentStep' }, isHide: true },
        { title: 'Transmitted', field: 'isTransmitted', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'isTransmitted' }, isHide: true },
        { title: 'Confidential', field: 'confidential', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'confidential' }, isHide: true },
        { title: 'Additional Reference', field: 'additionalReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'additionalReference' }, isHide: true },
        { title: 'Review Status', field: 'reviewStatus', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewStatus' }, isHide: true },
        { title: 'Model Reference', field: 'modelReference', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'modelReference' }, isHide: true },
        { title: 'Related Items', field: 'relatedItems', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'relatedItems' }, isHide: true },
        { title: 'Access Level', field: 'accessLevel', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'accessLevel' }, isHide: true },
        { title: 'Csi Spec Code', field: 'csiSpecCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'csiSpecCode' }, isHide: true },
        { title: 'Current', field: 'current', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'current' }, isHide: true },
        { title: 'Facility Code', field: 'facilityCode', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'facilityCode' }, isHide: true },
        { title: 'File Name', field: 'fileName', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'fileName' }, isHide: true },
        { title: 'Forecast Subm To Client', field: 'forecastSubmToClient', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'forecastSubmToClient' }, isHide: true },
        { title: 'Job Number', field: 'jobNumber', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'jobNumber' }, isHide: true },
        { title: 'Lock', field: 'lock', fieldType: FieldType.boolean, filter: { filterType: FilterType.boolean, filterName: 'lock' }, isHide: true },
        { title: 'Last Modified Date', field: 'lastModifiedDate', fieldType: FieldType.date, filter: { filterType: FilterType.date_default, filterName: 'lastModifiedDate' }, isHide: true },
        { title: 'Milestone', field: 'milestone', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'milestone' }, isHide: true },
        { title: 'No Of Markups', field: 'numberOfMarkups', fieldType: FieldType.number, filter: { filterType: FilterType.number, filterName: 'numberOfMarkups' }, isHide: true },
        { title: 'Activity Id', field: 'activityId', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'activityId' }, isHide: true },
        { title: 'Planned Submit Date', field: 'plannedSubmissionDate', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'plannedSubmissionDate' }, isHide: true },
        { title: 'Print Size', field: 'printSize', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'printSize' }, isHide: true },
        { title: 'Purchase Order', field: 'purchaseOrder', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'purchaseOrder' }, isHide: true },
        { title: 'Remarks', field: 'remarks', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'remarks' }, isHide: true },
        { title: 'Review Source', field: 'reviewSource', fieldType: FieldType.string, filter: { filterType: FilterType.string, filterName: 'reviewSource' }, isHide: true },
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

}
