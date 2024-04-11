import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableParameter, selectionMode, editMode } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from 'src/app/pages/shared/table-template/modules/table-filter.module';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';
import { AddRefDataComponent } from '../add-ref-data/add-ref-data.component';

@Component({
  selector: 'app-sub-area',
  templateUrl: './sub-area.component.html',
  styleUrls: ['./sub-area.component.scss']
})

export class SubAreaComponent implements OnInit {

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
    param.api = ApiURL.sub_area;
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
        { title: 'Description', field: 'description', fieldType: FieldType.string, width: '40%', filter: { filterType: FilterType.string, filterName: 'description' } },
        { title: 'Area', field: 'this.areaList.area.label', fieldType: FieldType.string, width: '30%', filter: { filterType: FilterType.string, filterName: 'this.areaList.area.label'} },
      ];
    return tableColumns;
  }

  onRowEdit = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.apiService.put(ApiURL.sub_area + "/" + event.object.id, event.object).subscribe(res => {
        this.utilities.notifySuccess("Sub Area Updated Successfully!");
      })
      resolve();
    });
  }

  onRowDelete = (event): Promise<void> => {
    return new Promise((resolve, reject) => this.utilities.confirmDialog("Are you sure you want to delete this Sub Area?").then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.sub_area + "/" + event.selectedObjects[0].id).subscribe(res => {
          this.utilities.notifySuccess("Sub Area Deleted Successfully!");
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

  onSubAreaAdd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '25%', height: '46%',
        styleClass: 'my-dialog-class',
        header: 'Sub Area Details',
        data: {
          type: 'sub area'
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
