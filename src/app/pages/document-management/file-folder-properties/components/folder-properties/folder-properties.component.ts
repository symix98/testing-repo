import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, editMode, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';
import { AddFolderPropsComponent } from './add-folder-props/add-folder-props.component';


@Component({
  selector: 'app-folder-properties',
  templateUrl: './folder-properties.component.html',
  styleUrls: ['./folder-properties.component.scss']
})

export class FolderPropertiesComponent implements OnInit {

  @Input() data: any;
  @Input() folderId: number;
  isDisable: boolean = false;
  isLoading: boolean = false;
  tableParam: TableParameter;
  subscriptions = new Subscription();
  @ViewChild('tbl') tblComponent: TableTemplateComponent;

  constructor(private apiService: ApiService, private utilities: UtilitiesService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.initTableParam();
  }

  async initTableParam() {
    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.api = ApiURL.folder_properties;
    param.defaultFilter = new Map<any, any>([['folderId', this.folderId]])
    param.withCache = true
    param.advancedSearch = true;
    param.alwaysShowAdvanced = true;
    param.selectionMode = selectionMode.single
    param.editMode = editMode.inplace;
    param.rowEdit = this.onRowEdit;
    param.rowDelete = this.onRowDelete;
    this.tableParam = param;
    console.log(param)
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '30%', filter: { filterType: FilterType.string, filterName: 'name' } },
        { title: 'Value', field: 'value', fieldType: FieldType.string, width: '30%', filter: { filterType: FilterType.string, filterName: 'value' } },
        // { title: 'Folder', field: 'folder.folderName', fieldType: FieldType.string, width: '30%' },
      ];
    return tableColumns;
  }

  onRowEdit = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.apiService.put(ApiURL.folder_properties + "/" + event.object.id, event.object).subscribe(res => {
        this.utilities.notifySuccess("Attribute Updated Successfully!");
      })
      resolve();
    });
  }

  onRowDelete = (event): Promise<void> => {
    return new Promise((resolve, reject) => this.utilities.confirmDialog("Are you sure you want to delete this Attribute?").then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.folder_properties + "/" + event.selectedObjects[0].id).subscribe(res => {
          this.utilities.notifySuccess("Attribute Deleted Successfully!");
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam();
          }, 10);
          resolve();
        })
      } else {
        resolve();
      }
    }));
  }

  onFolderPathAdd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddFolderPropsComponent, {
        width: '25%', height: '46%',
        styleClass: 'my-dialog-class',
        header: 'Add Folder Path Details',
        data: {
          folderId: this.folderId,
        },
      })
      ref.onClose.subscribe((result) => {
        if (result) {
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam();
          }, 10);
          resolve();
        } else {
          resolve();
        }
      })
    })
  }

}
