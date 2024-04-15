import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { Transaction } from 'src/app/core/models/transaction.model';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit, OnDestroy {
  transactionDialog: boolean = false;

  transactions: Transaction = new Transaction();

  selectedTransactions!: Transaction[] | null;

  submitted: boolean = false;

  guestStatuses!: any[];

  availableRooms!: any[];

  subscription = new Subscription();

  constructor(
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // getGuestStatuses()
  }

  saveTransaction() {
    this.subscription.add(this.apiService.post(ApiURL.transaction, this.transactions).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.utilitiesService.notifyError(err.error.title);
        throw new Error('Could not perform operation!');
      }
    ));
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }
}
