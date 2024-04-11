import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-app-user-add',
  templateUrl: './app-user-add.component.html',
  styleUrls: ['./app-user-add.component.scss']
})
export class AppUserAddComponent implements OnInit {
  
  userId:string
  email:string
  name:string
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
    ) { }

  ngOnInit(): void {
  }

  AddUser(){
    let user = {
      userId :  this.userId,
      email: this.email,
      name: this.name,
      isAdministrator:false,
      inactive: false
    }
    this.dialogRef.close(user)
  }

}
