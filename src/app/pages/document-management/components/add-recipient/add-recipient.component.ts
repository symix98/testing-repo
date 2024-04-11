import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { AppUsers } from 'src/app/core/models/app-users.model';
import { TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.scss'],
})
export class AddRecipientComponent implements OnInit, OnDestroy, AfterViewInit {
  appUsers!: any[];
  subscriptions = new Subscription();
  tableParam: TableParameter;
  currentUser: AppUsers;
  selectedAppUsers: any[] = [];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private dialogRef: DynamicDialogRef,
    private utilitiesService: UtilitiesService
  ) {}

  async ngAfterViewInit() {
    this.currentUser = await this.utilitiesService.getCurrentAppUser();
    this.getAllAppUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async ngOnInit() {
    
  }

  getAllAppUsers() {
    this.subscriptions.add(
      this.apiService.get(ApiURL.appusers).subscribe((appUser) => {
        this.appUsers = appUser;
        this.appUsers = this.appUsers.filter((user) => {
          return user.userId !== this.currentUser.userId;
        });
        this.cdr.markForCheck();
      })
    );
  }

  saveSelectedAppUsers() {
    this.dialogRef.close(this.selectedAppUsers);
  }
}
