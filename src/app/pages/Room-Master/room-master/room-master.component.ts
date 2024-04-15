import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/core/models/employee.model';
import { ProductService } from 'src/app/core/services/fake-data';
import { CustomerService } from 'src/app/core/services/fakedata-customers';

@Component({
  selector: 'app-room-master',
  templateUrl: './room-master.component.html',
  styleUrls: ['./room-master.component.scss'],
  providers: [ProductService, CustomerService],
})
export class RoomMasterComponent implements OnInit {
  employees: Employee[];
  selectedEmployees!: Employee[] | null;

  constructor() {}

  ngOnInit() {}

  openNewEmployee() {}

  openEditEmployee(employee: Employee) {}

  deleteEmployee(employee: Employee) {}

  deleteSelectedProducts() {}

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

  //expanded table
  calculateCustomerTotal(customerName: any) {}

  getCustomerSeverity(customerStatus: any) {}
}
