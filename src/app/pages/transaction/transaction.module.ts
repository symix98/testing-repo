import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from '../../core/modules/routing/transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';


@NgModule({
  declarations: [
    TransactionComponent,
    EditTransactionComponent,
    AddTransactionComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
  ]
})
export class TransactionModule { }
