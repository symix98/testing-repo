import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mto-view',
  templateUrl: './mto-view.component.html',
  styleUrls: ['./mto-view.component.scss']
})
export class MtoViewComponent implements OnInit {
  supportItemList: any[] = [];
  supportItemListCols: any[] = [];
  isLoading: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.supportItemListCols = [
      { field: 'name', header: 'Name' },
      { field: 'code', header: 'Code' },
      { field: 'description', header: 'Description' },
    ];


    this.supportItemList = [
      { id: 1, name: 'Name1', code: 'Code1', description: 'Description1' },
      { id: 2, name: 'Name2', code: 'Code2', description: 'Description2' },
      { id: 3, name: 'Name3', code: 'Code3', description: 'Description3' },
      { id: 4, name: 'Name4', code: 'Code4', description: 'Description4' },
      { id: 5, name: 'Name5', code: 'Code5', description: 'Description5' },
    ];

  }


  moveBack() {
    this.router.navigate(['materials-takeoff'])

  }
}
