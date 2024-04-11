import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { TableFunctionArgument } from '../models/table-model/table-function-argument';
import { ApiService } from './api.service';
import { UtilitiesService } from './utilities.service';

@Injectable({ providedIn: 'root' })
export class CustomTableService {

  constructor(
    public dialogService: DialogService,
    private api: ApiService,
    private utilities: UtilitiesService) { }


  delete = (args: TableFunctionArgument): Promise<any> => {
    return new Promise((resolve, reject) => this.utilities.confirmDialog("Are you sure you want to delete this data?").then((confirm) => {
      if (confirm) {
        for (let i = 0; i < args.selectedObjects.length; i++) {
          const selected = args.selectedObjects[i];
          const id = selected[args.dataKey];
          this.api.delete(`${args.api}/${id}`).subscribe(() => {
            if (i == args.selectedObjects.length - 1) {
              this.utilities.notifySuccess("Rows deleted successfully");
              args.refresh = true;
              resolve(args);
            }
            i++;
          }, (err) => {
            this.utilities.notifyError(err.error.title);
            resolve(args)
          });
        }
      }
      else {
        resolve(args);
      }
    }));
  }

  addRow = (args: TableFunctionArgument): Promise<any> => {
    return new Promise((resolve, reject) => {
      const ids = args.data.map(entity => entity.id);
      const sorted = ids.sort((a, b) => a - b);
      let newID = sorted[sorted.length - 1] + 1;
      newID = newID ? newID : undefined;
      let row = {}
      row[args.dataKey] = newID
      row['new'] = true;
      args.addedObject = { ...row };
      args.table.value.unshift(row);
      args.table.initRowEdit(row);
      resolve(args);
    });
  }

  exportData = (args: TableFunctionArgument): Promise<any> => {
    return new Promise((resolve, reject) => {
      args.table.exportCSV();
      args.refresh = false;
      resolve(args);
    });
  }

  // importData = (properties: any[]) => {
  //   this.dialogService.open(ImportExportComponent, {
  //     width: '85vw'
  //   });
  // }
}
