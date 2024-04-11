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
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

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
    param.api = ApiURL.categories_id_refs;
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
        { title: 'Number', field: 'number', fieldType: FieldType.number, width: '15%', filter: { filterType: FilterType.number, filterName: 'number' } },
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '15%', filter: { filterType: FilterType.string, filterName: 'name' } },
        { title: 'Target Accept Number', field: 'targetAcceptNumber', fieldType: FieldType.number, width: '30%', filter: { filterType: FilterType.number, filterName: 'targetAcceptNumber' } },
        { title: 'Result', field: 'result', fieldType: FieldType.string, width: '30%', filter: { filterType: FilterType.string, filterName: 'result' } },
      ];
    return tableColumns;
  }

  onRowEdit = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.apiService.put(ApiURL.categories_id_refs + "/" + event.object.id, event.object).subscribe(res => {
        this.utilities.notifySuccess("Categories Updated Successfully!");
      })
      resolve();
    });
  }

  onRowDelete = (event): Promise<void> => {
    return new Promise((resolve, reject) => this.utilities.confirmDialog("Are you sure you want to delete this Categories?").then((confirm) => {
      if (confirm) {
        this.apiService.delete(ApiURL.categories_id_refs + "/" + event.selectedObjects[0].id).subscribe(res => {
          this.utilities.notifySuccess("Categories Deleted Successfully!");
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

  onCategoriesAdd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '25%', height: '46%',
        styleClass: 'my-dialog-class',
        header: 'Categories Details',
        data: {
          type: 'categories'
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
