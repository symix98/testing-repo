import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MaterialTakeoffFormComponent } from 'src/app/pages/fabrication-management/Engineering/mat-takeoff/components/material-takeoff-form/material-takeoff-form.component';

@Component({
  selector: 'app-popup-mto-details',
  templateUrl: './popup-mto-details.component.html',
  styleUrls: ['./popup-mto-details.component.scss']
})
export class PopupMtoDetailsComponent implements OnInit {

  constructor(
    private dialogService : DialogService
  ) { }

  @Input() data : any
  ngOnInit(): void {
    console.log(this.data)
  }
  onClick(){
    this.dialogService.open(MaterialTakeoffFormComponent,{
      header: 'Support Item Details',
      data: this.data,
      width: '70%'
    })

  }
}
