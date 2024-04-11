import { Component, OnInit, ViewChild } from '@angular/core';
import { UserFilterComponent } from './user-filter/user-filter.component';

@Component({
  selector: 'app-document-filter',
  templateUrl: './document-filter.component.html',
  styleUrls: ['./document-filter.component.scss']
})
export class DocumentFilterComponent implements OnInit {

  constructor() { }

  filterQuery: any
  searchData: any
  ngOnInit(): void {



  }
  onFilterSelect(e) {
    this.filterQuery = e
  }
  onSearchClicked(e){
    this.searchData = e
  }


}
