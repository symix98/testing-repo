import { Component, OnInit } from '@angular/core';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableColumn, FieldType } from 'src/app/core/models/table-model/table-column.model';
import { TableButton, ButtonPlace } from 'src/app/core/models/table-model/table-button.model';
import { TableFunctionArgument } from '../../../shared/table-template/modules/table-function.model';
import { TableParameter, selectionMode } from 'src/app/core/models/table-model/table-parameter.model';


@Component({
  selector: 'app-rsf-assign',
  templateUrl: './rsf-assign.component.html',
  styleUrls: ['./rsf-assign.component.scss']
})

export class RsfAssignComponent implements OnInit {

  tableParam: TableParameter;

  constructor(private dialogRef: DynamicDialogRef, private dynamicDialogConfig: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.initTableParams();
  }

  initTableParams() {
    let param: TableParameter = new TableParameter();
    param.columns = this.initTableColumns();
    param.paginator = false;
    if (this.dynamicDialogConfig.data.role)
      param.api = ApiURL.appusers + "/byRole/" + this.dynamicDialogConfig.data.role;
    else
      param.api = ApiURL.appusers;
    if (this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.selectionMode) {
      param.selectionMode = this.dynamicDialogConfig.data.selectionMode;
      if (param.selectionMode == selectionMode.mulitple)
        param.buttons = this.initTableButtons();
      else
        param.onRowSelected = this.closeSelectedDialog;
    }
    this.tableParam = param;
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '30%' },
        { title: 'Email', field: 'email', fieldType: FieldType.string, width: '30%' },
      ];
    return tableColumns;
  }

  initTableButtons(): TableButton[] {
    let tableButtons: TableButton[] =
      [
        { title: 'Send', place: ButtonPlace.footer, customFunction: this.closeDialog, disabled: true },
      ];
    return tableButtons;
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
