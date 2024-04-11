import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ButtonPlace, TableButton } from 'src/app/core/models/table-model/table-button.model';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';

@Component({
  selector: 'app-wfp-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  tableParam: TableParameter;

  constructor(private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef) { }

  ngOnInit(): void {
    this.initTableParams();
  }

  initDialogTableButtons(): TableButton[] {
    let tableButtons: TableButton[] = [
      { title: 'Save', place: ButtonPlace.footer, customFunction: this.closeDialog, disabled: true },
    ]
    return tableButtons;
  }

  initTableParams() {
    let param: TableParameter = new TableParameter();
    param.dataKey = "roleId"
    param.columns = this.initTableColumns();
    param.api = ApiURL.roles;
    if (this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.selectionMode) {
      param.selectionMode = this.dynamicDialogConfig.data.selectionMode;
      if (param.selectionMode == selectionMode.mulitple)
        param.buttons = this.initDialogTableButtons();
        else
        param.onRowSelected = this.closeSelectedDialog;
    }
    this.tableParam = param;

  }

  closeSelectedDialog = (args: TableFunctionArgument): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (args.selected) {
        this.dialogRef.close(args.selected);
      }
      if (args.selectedObjects && args.selectedObjects.length > 0) {
        this.dialogRef.close(args.selectedObjects);
      }
    });
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Role', field: 'roleId', fieldType: FieldType.string, width: '50%' },
        { title: 'Description', field: 'description', fieldType: FieldType.string, width: '50%' },
      ];
    return tableColumns;
  }

  closeDialog = (args: TableFunctionArgument): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (args.selected) {
        this.dialogRef.close(args.selected);
      }
      if (args.selectedObjects && args.selectedObjects.length > 0) {
        this.dialogRef.close(args.selectedObjects);
      }
      else {
        this.dialogRef.close(null);
      }
      resolve();
    });
  }
}
