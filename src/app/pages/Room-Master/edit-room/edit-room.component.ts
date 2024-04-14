import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/core/models/employee.model';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit {

  employee: Employee;
  categories: any[]

  constructor() { }

  ngOnInit(): void {
  }

  closeEditEmployee() {

  }

  saveEmployee() {

  }

}
