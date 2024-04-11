import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SupportHeadersModel } from 'src/app/core/models/support-fab-models/support/SupportHeaders.model';
import { SupportsModel } from 'src/app/core/models/support-fab-models/supports.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { SupportsComponent } from 'src/app/pages/fabrication-management/Support-fabrication-module/supports/supports.component';

@Component({
  selector: 'app-rsf-support-list',
  templateUrl: './rsf-support-list.component.html',
  styleUrls: ['./rsf-support-list.component.scss']
})
export class RsfSupportListComponent implements OnInit {

  @Output() selectedTags = new EventEmitter<any>();
  @Output() onSelectedType = new EventEmitter<any>();
  @Input() isDisabled : boolean
  tableParam: TableParameter;
  tableFilter: String = ""
  tableData: any[] = []
  Categories: string[] = [];
  selectedTag: any[] = []
  selectedIds: any[] = []
  cols: any[]
  loading: boolean = false
  isLoading: boolean = false
  isAdding = false;
  isEdit:boolean = true
  isEditHeader:boolean =true
  totalRecords:number = 0
  stateOptions:any[]
  selectedType:any
  constructor(private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private apiService: ApiService,
    private dialogService: DialogService,
    private utilities: UtilitiesService) { }

  ngOnInit(): void {
    this.cols = [
      // { header: 'Item No', field: 'code' },
      { header: 'Support Tag', field: 'supTAG' },
      { header: 'Description', field: 'supStDes' },
      { header: 'Parent Isono', field: 'parentIso' },
      { header: 'Parent Spool', field: 'parentSpl' },
      { header: 'Parent class', field: 'parentCls' },
      { header: 'Support Type', field: 'support' },
      { header: 'Support Serial', field: 'suppItem' },
      { header: 'Support Paint', field: 'suppPnt' },
      { header: 'Iso Paint', field: 'parentPnt' },
      { header: 'Weight (KG)', field: 'supWT' },
      { header: 'QTY', field: 'qty' },
    ]

  }

  startSelect() {
    this.isAdding = !this.isAdding
    this.dialogService.open(SupportsComponent, {
      header: 'Please Select Supports',
      width: '80%',
      data: {
        selectionMode: selectionMode.mulitple,
      }
    }).onClose.subscribe(res => {
      if(res){
        let supports = [] 
        res.forEach((support:SupportsModel) => {
          supports.push({
            id : support.id,
            supTAG:support.supTAG,
            supStDes:support.supStDes,
            parentIso: support.supportParents.parentIso,
            parentSpl: support.supportParents.parentSpl,
            parentCls: support.supportParents.parentCls,
            support: support.support,
            suppItem: support.suppItem,
            suppPnt: support.suppPnt,
            parentPnt: support.supportParents.parentPnt,
            supWT: support.supWT,
            qty:1,
          })
        });
        let td = this.tableData
        td = td.concat(supports)
        this.tableData = [... new Set(td)]
        this.selectedTags.emit(this.tableData)
        this.totalRecords = this.tableData.length

      }
      
    })
  }
 
  onEditComplete(e) {

  }
  deleteRow(e) {
    this.utilities.confirmDialog("Are you sure you want to delete this operation").then(result => {
      if (result) {
        this.tableData.splice(this.tableData.indexOf(e), 1)
        this.selectedTags.emit(this.tableData)

      }
    })
  }




}
