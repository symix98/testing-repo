import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Employee } from 'src/app/core/models/employee.model';
import { Transaction } from 'src/app/core/models/transaction.model';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  transactionDialog: boolean = false;

  transactions!: Transaction[];

  selectedTransactions!: Transaction[] | null;

  submitted: boolean = false;

  GuestStatus!: any[];

  subscription = new Subscription();

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private ref: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.GuestStatus = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];
    // get all transactions
    this.subscription.add(this.apiService.get(ApiURL.transaction).subscribe(
      (res) => {
        console.log(res);
        this.transactions = res;      
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation!');
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteSelectedTransactions() {

  }

  editTransaction(transaction: Transaction) {}

  deleteTransaction(transaction: Transaction) {
  this.utilitiesService.confirmDialog("Are you sure you want to delete this data?").then((confirm) => {
    if(confirm) {
    this.subscription.add(this.apiService.delete(ApiURL.transaction + "/" + transaction.id).subscribe(
      (res) => {
        this.utilitiesService.notifySuccess('Transaction Deleted');
        this.ngOnInit();
      },
      (err) => {
        this.utilitiesService.notifyError('Could not perform operation!');
      }
    ));
  }
});
  }

  hideDialog() {}

  saveProduct() {}

  openNewTransaction() {
    this.dialogService
      .open(AddTransactionComponent, {
        header: 'Add Transaction',
        height: '70vh',
        width: '50%',
        modal: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);          
        }
      });
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    return '';
  }

  getSeverity(status: string) {
    switch (status) {
      case 'inCamp':
        return 'success';
      case 'outCamp':
        return 'danger';
    }
  }
}
