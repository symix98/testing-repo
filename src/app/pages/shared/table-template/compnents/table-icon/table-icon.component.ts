import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-icon',
  templateUrl: './table-icon.component.html',
  styleUrls: ['./table-icon.component.scss']
})
export class TableIconComponent implements OnInit {

  ShowIcon:boolean= false
  constructor() { }
  @Input() data : any
  ngOnInit(): void {
  }

}
