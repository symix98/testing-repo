import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, editMode, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';
import { AddRefDataComponent } from '../add-ref-data/add-ref-data.component';

@Component({
  selector: 'app-documents-type',
  templateUrl: './documents-type.component.html',
  styleUrls: ['./documents-type.component.scss']
})

export class DocumentsTypeComponent implements OnInit {
  
  isDisable: boolean = false;
  isLoading: boolean = false;
  tableParam: TableParameter;
  subscriptions = new Subscription();
  @ViewChild('tbl') tblComponent: TableTemplateComponent;

  constructor(private apiService: ApiService, private utilities: UtilitiesService, private dialogService: DialogService) { }

  ngOnInit(): void { this.initTableParam(); }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.api = ApiURL.documents_types;
    param.withCache = true
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    param.editMode = editMode.inplace;
    param.rowEdit = this.onRowEdit;
    param.rowDelete = this.onRowDelete;
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'name' } },
        { title: 'Code', field: 'code', fieldType: FieldType.string, width: '25%', filter: { filterType: FilterType.string, filterName: 'code' } },
        { title: 'Description', field: 'description', fieldType: FieldType.string, width: '40%', filter: { filterType: FilterType.string, filterName: 'description' } },
      ];
    return tableColumns;
  }

  onRowEdit = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.apiService.put(ApiURL.documents_types + "/" + event.object.id, event.object).subscribe(res => {
        this.utilities.notifySuccess("Document Type Updated Successfully!");
      })
      resolve();
    });
  }

  onRowDelete = (event): Promise<void> => {
    return new Promise((resolve, reject) => this.utilities.confirmDialog("Are you sure you want to delete this Document Type?").then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.documents_types + "/" + event.selectedObjects[0].id).subscribe(res => {
          this.utilities.notifySuccess("Document Type Deleted Successfully!");
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam()
          }, 10);
          resolve()
        })
      } else {
        resolve();
      }
    }));
  }

  onDocumentTypeAdd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '25%', height: '46%',
        styleClass: 'my-dialog-class',
        header: 'Document Type Details',
        data: {
          type: 'document type'
        },
      })
      ref.onClose.subscribe((result) => {
        if (result) {
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam()
          }, 10);
          resolve()
        } else {
          resolve()
        }
      })
    })
  }

}
