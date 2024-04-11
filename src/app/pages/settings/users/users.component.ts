import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { ButtonIcon, ButtonPlace } from 'src/app/core/models/table-model/table-button.model';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { AppUserRole } from 'src/app/core/models/app-user-role.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomTableService } from 'src/app/core/services/custom-table.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { TableTemplateComponent } from 'src/app/pages/shared/table-template/table-template.component';
import { RolesComponent } from '../roles/roles.component';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { ISecurityButton } from 'src/app/core/models/security-model/security-component.model';
import { SecurityEntity } from 'src/app/core/models/security-model/security-entity.model';
import { SecurityAction } from 'src/app/core/models/security-model/security-action.model';
import { AppUserAddComponent } from '../app-user-add/app-user-add.component';
import { FilterType } from '../../shared/table-template/modules/table-filter.module';
import { AppUserImportComponent } from '../app-user-import/app-user-import.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('tbl') tblComponent: TableTemplateComponent;

  subscriptions = new Subscription();
  tableParam: TableParameter;
  appUsers: AppUsers[];
  count: number = 0;
  constructor(
    private tableService: CustomTableService,
    private utilities: UtilitiesService,
    private dialogService: DialogService,
    private apiService: ApiService,
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef) {
    this.initTableParam();
  }

  ngOnInit(): void {
  }

  async initTableParam() {
    // await this.getAppUsers();
    this.count = 0
    let param: TableParameter = new TableParameter();

    param.columns = this.initTableColumns();
    param.selectionMode = selectionMode.mulitple;
    param.api = ApiURL.appusers;
    param.dataKey = 'userId';
    param.searchable = false
    param.advancedSearch = true
    param.alwaysShowAdvanced = true
    let formData = this.dynamicDialogConfig.data;
    if (formData) {
      param.selectionMode = formData.selectionMode;
      param.onRowSelected = this.closeSelectedDialog;
    }
    if (this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.userIds) {
      param.selectionMode = this.dynamicDialogConfig.data.selectionMode;
      param.defaultFilter = new Map<string, any>([['userId', this.dynamicDialogConfig.data.userIds]]);
      param.onRowSelected = this.closeSelectedDialog;
    } else param.buttons = this.initTableButtons();
    param.onCheckBoxSelected = this.closeSelectedDialog
    this.tableParam = param;
  }

  getAppUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.get(ApiURL.appusers).subscribe((res) => {
        this.appUsers = res;
        resolve();
      });
    })
  }

  closeSelectedDialog = (args: TableFunctionArgument): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.count = args?.selected?.length
      this.tblComponent.tableParam.buttons[0].title = 'Action (' + this.count + ")"
      this.count > 0 ? this.tblComponent.tableParam.buttons[0].disabled = false : this.tblComponent.tableParam.buttons[0].disabled = true
      if (args.selected) {
        this.dialogRef.close(args.selected);
      }
      if (args.selectedObjects && args.selectedObjects.length > 0) {
        this.dialogRef.close(args.selectedObjects);
      }
    });
  }

  initTableButtons(): ISecurityButton[] {
    let tableButtons: ISecurityButton[] = [
      // {
      //   title: 'Set/Unset Admin',
      //   place: ButtonPlace.header,
      //   items: [{
      //     label: 'Set', command: () => this.setAdmin(true)
      //   },
      //   {
      //     label: 'Unset', 
      //     command: () => this.setAdmin(false)
      //   }], disabled: true,
      //   entity: [SecurityEntity.settings], action: SecurityAction.manage
      // },

      {
        title: 'Action (' + this.count + ")",
        icon: 'pi pi-user-edit',
        place: ButtonPlace.header,
        items: [
          {
            label: 'Set Admin',
            icon: 'pi pi-user-edit',
            command: () => this.setAdmin(true)
          },
          {
            label: 'Unset Admin',
            icon: 'pi pi-user-edit',
            command: () => this.setAdmin(false)
          },
          { separator: true },
          {
            label: 'Edit Role',
            icon: 'pi pi-users',
            command: () => this.assignRole()
          },
          // {
          //   label: 'Edit Discipline',
          //   icon: 'pi pi-users',
          //   command: () => this.assignDiscpline()
          // },
          // {
          //   label: 'Edit Location',
          //   icon: 'pi pi-map-marker',
          //   command: () => this.assignLocation()
          // }
        ], disabled: true,
        entity: [SecurityEntity.settings], action: SecurityAction.manage
      },
      {
        title: 'Add / Remove',
        icon: 'pi pi-user',
        place: ButtonPlace.header,
        items: [
          {
            label: 'Add User',
            command: () => this.addUser(),
            icon: 'pi pi-user-plus'
          },
          {
            label: 'Remove Users',
            icon: 'pi pi-user-minus',
            command: () => this.RemoveUser()
          },
          { separator: true },
          {
            label: 'Import Users',
            command: () => this.importUsers(),
            icon: 'pi pi-user-plus'
          }
        ], disabled: true,
        entity: [SecurityEntity.settings], action: SecurityAction.manage
      },
      // { title: 'Assign Role', place: ButtonPlace.header, customFunction: this.assignRole, disabled: true, entity: [SecurityEntity.settings], action: SecurityAction.manage },
      // { title: 'Assign Discipline', place: ButtonPlace.header, customFunction: this.assignDiscpline, disabled: true, entity: [SecurityEntity.settings], action: SecurityAction.manage },
      // { title: 'Import Users', icon:'pi pi-user-plus', place: ButtonPlace.header, customFunction: this.assignDiscpline, disabled: false, entity: [SecurityEntity.settings], action: SecurityAction.manage },
      // { title: 'Export', place: ButtonPlace.header, icon: ButtonIcon.export, customFunction: this.tableService.exportData, disabled: false, entity: [SecurityEntity.settings], action: SecurityAction.read },
    ]
    return tableButtons;
  }
  importUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AppUserImportComponent, {
        header: "Import Users",
        width: '60%'
      });

      this.subscriptions.add(ref.onClose.subscribe((result) => {
        if (result) {
          this.tableParam = null
          setTimeout(() => {
            this.initTableParam()
          }, 10);
          resolve()
        } else {
          resolve()
        }

      }))
    }
    )
  }

  assignRole = (): Promise<any> => {
    let args = new TableFunctionArgument()
    args.selectedObjects = this.tblComponent.selectedObjects
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(RolesComponent, {
        data: {
          selectionMode: selectionMode.mulitple,
        },
        header: "Assign Role",
        width: '60%'
      });

      this.subscriptions.add(ref.onClose.subscribe((result: AppUserRole[]) => {
        if (result) {
          for (let j = 0; j < args.selectedObjects.length; j++) {
            let user = args.selectedObjects[j];
            user.roles = result;
            this.apiService.put(ApiURL.appusers, user).subscribe(() => {
              if (j == args.selectedObjects.length - 1) {
                this.utilities.notifySuccess("Roles assigned successfully");
                args.refresh = true;
                resolve(args);
              }
            }, () => {
              this.utilities.notifyError("Error while assigning role");
              resolve(args)
            });
          }
        } else {
          resolve(args)
        }

      }))
    }
    )

  }

  // assignDiscpline = (): Promise<any> => {
  //   let args = new TableFunctionArgument()
  //   args.selectedObjects = this.tblComponent.selectedObjects
  //   return new Promise((resolve, reject) => {
  //     const ref = this.dialogService.open(DiscplineComponent, {
  //       data: {
  //         selectionMode: selectionMode.single,
  //       },
  //       header: "Assign Discipline",
  //       width: '60%'
  //     });

  //     this.subscriptions.add(ref.onClose.subscribe((result) => {
  //       if (result) {
  //         for (let j = 0; j < args.selectedObjects.length; j++) {
  //           let user = args.selectedObjects[j];

  //           let disc = user?.settings.filter(s => s.property == 'discpline')
  //           if (disc.length > 0) {
  //             let discipline = {
  //               "id": disc[0].id,
  //               "property": 'discpline',
  //               "value": result.value,
  //               "appUser": {
  //                 userId: user.userId
  //               }
  //             }
  //             user.settings = [discipline];
  //             this.apiService.put(ApiURL.app_user_settings + "/" + disc[0].id, discipline).subscribe(() => {
  //               if (j == args.selectedObjects.length - 1) {
  //                 this.utilities.notifySuccess("Discipline Added Successfully");
  //                 args.refresh = true;
  //                 resolve(args);
  //                 this.tableParam = null
  //                 setTimeout(() => {
  //                   this.initTableParam()
  //                 }, 10);

  //               }
  //             }, () => {
  //               this.utilities.notifyError("Error while assigning Discipline");
  //               resolve(args)
  //             });
  //           } else {
  //             let discipline = {
  //               "property": 'discpline',
  //               "value": result.value,
  //               "appUser": {
  //                 userId: user.userId
  //               }
  //             }
  //             user.settings = [discipline];
  //             this.apiService.post(ApiURL.app_user_settings, discipline).subscribe(() => {
  //               if (j == args.selectedObjects.length - 1) {
  //                 this.utilities.notifySuccess("Discipline Added Successfully");
  //                 args.refresh = true;
  //                 this.tableParam = null
  //                 setTimeout(() => {
  //                   this.initTableParam()
  //                 }, 10);
  //                 resolve(args);
  //               }
  //             }, () => {
  //               this.utilities.notifyError("Error while assigning Discipline");
  //               resolve(args)
  //             });
  //           }

  //         }
  //         resolve(args)
  //       } else {
  //         resolve(args)
  //       }

  //     }))
  //   }
  //   )

  // }
  // assignLocation = (): Promise<any> => {
  //   let args = new TableFunctionArgument()
  //   args.selectedObjects = this.tblComponent.selectedObjects
  //   return new Promise((resolve, reject) => {
  //     const ref = this.dialogService.open(DiscplineComponent, {
  //       data: {
  //         selectionMode: selectionMode.single,
  //         type : 'location'
  //       },
  //       header: "Assign Location",
  //       width: '60%'
  //     });

  //     this.subscriptions.add(ref.onClose.subscribe((result) => {
  //       if (result) {
  //         for (let j = 0; j < args.selectedObjects.length; j++) {
  //           let user = args.selectedObjects[j];

  //           let disc = user?.settings.filter(s => s.property == 'location')
  //           if (disc.length > 0) {
  //             let discipline = {
  //               "id": disc[0].id,
  //               "property": 'location',
  //               "value": result.name,
  //               "appUser": {
  //                 userId: user.userId
  //               }
  //             }
  //             user.settings = [discipline];
  //             this.apiService.put(ApiURL.app_user_settings + "/" + disc[0].id, discipline).subscribe(() => {
  //               if (j == args.selectedObjects.length - 1) {
  //                 this.utilities.notifySuccess("Location Added Successfully");
  //                 args.refresh = true;
  //                 resolve(args);
  //                 this.tableParam = null
  //                 setTimeout(() => {
  //                   this.initTableParam()
  //                 }, 10);

  //               }
  //             }, () => {
  //               this.utilities.notifyError("Error while assigning Location");
  //               resolve(args)
  //             });
  //           } else {
  //             let discipline = {
  //               "property": 'location',
  //               "value": result.name,
  //               "appUser": {
  //                 userId: user.userId
  //               }
  //             }
  //             user.settings = [discipline];
  //             this.apiService.post(ApiURL.app_user_settings, discipline).subscribe(() => {
  //               if (j == args.selectedObjects.length - 1) {
  //                 this.utilities.notifySuccess("Location Added Successfully");
  //                 args.refresh = true;
  //                 this.tableParam = null
  //                 setTimeout(() => {
  //                   this.initTableParam()
  //                 }, 10);
  //                 resolve(args);
  //               }
  //             }, () => {
  //               this.utilities.notifyError("Error while assigning location");
  //               resolve(args)
  //             });
  //           }

  //         }
  //         resolve(args)
  //       } else {
  //         resolve(args)
  //       }

  //     }))
  //   }
  //   )

  // }

  setAdmin(set: boolean) {
    this.utilities.confirmDialog("Are you sure you want to update the selected users as adminstrators?")
      .then((confirm) => {
        if (confirm) {
          for (let i = 0; i < this.tblComponent.selectedObjects.length; i++) {
            const selected = this.tblComponent.selectedObjects[i];
            selected.isAdministrator = set;
            this.apiService.put(ApiURL.appusers, selected).subscribe(() => {
              if (i == this.tblComponent.selectedObjects.length - 1) {
                this.utilities.notifySuccess("Rows updated successfully");
              }
            })
          }
        }
      })
  }

  RemoveUser() {
    this.utilities.confirmDialog("Are you sure you want to Remove the selected users ?")
      .then((confirm) => {
        if (confirm) {
          for (let i = 0; i < this.tblComponent.selectedObjects.length; i++) {
            const selected = this.tblComponent.selectedObjects[i];
            this.apiService.delete(ApiURL.appusers + "/" + selected.userId).subscribe(() => {
              if (i == this.tblComponent.selectedObjects.length - 1) {
                this.utilities.notifySuccess("Users removed successfully");
                this.tableParam = null
                setTimeout(() => {
                  this.initTableParam()
                }, 10);
              }
            })
          }
        }
      })
  }

  initTableColumns(): TableColumn[] {
    let tableColumns: TableColumn[] =
      [
        { title: 'Name', field: 'name', fieldType: FieldType.string, width: '20%', filter: { filterType: FilterType.string, filterName: 'name' } },
        { title: 'Email', field: 'email', fieldType: FieldType.string, width: '20%', filter: { filterType: FilterType.string, filterName: 'email' } },
        { title: 'Administrator', field: 'isAdministrator', fieldType: FieldType.boolean, width: '20%' },
        { title: 'Role', field: 'roles.roleId', fieldType: FieldType.object, objectReference: row => row['roles'] ? this.joinRoles(row['roles']) : '', width: '20%' },
        { title: 'Location', field: 'appUserSettings.value', fieldType: FieldType.object, objectReference: row => row['settings'] ? this.getLocation(row['settings']) : '', width: '20%' },
        // { title: 'Discipline', field: 'appUserSettingsId', fieldType: "component1", specialColumn: TableTagLabelComponent }
      ];
    return tableColumns;
  }

  addUser() {
    let args = new TableFunctionArgument()
    args.selectedObjects = this.tblComponent.selectedObjects
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AppUserAddComponent, {
        header: "Add User",
        width: '60%'
      });

      this.subscriptions.add(ref.onClose.subscribe((result) => {
        if (result) {
          let user: AppUsers = new AppUsers()
          user.userId = result.userId
          user.email = result.email
          user.name = result.name
          user.isAdministrator = false
          user.inactive = false
          this.apiService.post(ApiURL.appusers, user).subscribe(res => {
            this.utilities.notifySuccess("User added successfully");
            this.tableParam = null
            setTimeout(() => {
              this.initTableParam()
            }, 10);
            resolve(args)
          }, () => {
            this.utilities.notifyError("Error while adding user");
            resolve(args)
          })

        } else {
          resolve(args)
        }

      }))
    }
    )
  }

  joinRoles(roles: AppUserRole[]): any {
    let rolesDescription: string[] = [];
    roles.forEach(role => rolesDescription.push(role.description))
    return rolesDescription.join(",")
  }
  getLocation(settings: any[]) {
    if (settings.length > 0) {
      let discpline = settings.filter(s => s.property == 'location')
      return discpline.length > 0 ? discpline[0].value : ''
    }
  }
}
