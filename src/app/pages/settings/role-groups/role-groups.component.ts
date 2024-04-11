import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AddRefDataComponent } from '../reference-components/add-ref-data/add-ref-data.component';


@Component({
  selector: 'app-role-groups',
  templateUrl: './role-groups.component.html',
  styleUrls: ['./role-groups.component.scss']
})

export class RoleGroupsComponent implements OnInit {

  isDisable: boolean = false;
  isLoading: boolean = false;
  isSelected: any[];
  rolesTableData: any[];
  subscriptions = new Subscription();

  constructor(private apiService: ApiService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.initGetAllRoles();
  }

  initGetAllRoles() {
    this.isLoading = true;
    this.apiService.get(ApiURL.roles).subscribe((res: any[]) => {
      if (res && res.length > 0) {
        this.rolesTableData = res;
      }
    })
    this.isLoading = false;
  }

  onRowSelected = (event): Promise<void> => {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '25%', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Role Details',
        data: {
          type: 'role',
          id: event.data.roleId
        },
      })
      ref.onClose.subscribe((result) => {
        if (result) {
          setTimeout(() => {
            this.initGetAllRoles();
          }, 10);
          resolve();
        }
      })
    })
  }

  onRolesAdd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ref = this.dialogService.open(AddRefDataComponent, {
        width: '25%', height: 'auto',
        styleClass: 'my-dialog-class',
        header: 'Role Details',
        data: {
          type: 'role'
        },
      })
      ref.onClose.subscribe((result) => {
        if (result) {
          setTimeout(() => {
            this.initGetAllRoles();
          }, 10);
          resolve();
        } else {
          resolve();
        }
      })
    })
  }

}
