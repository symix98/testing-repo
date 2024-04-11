import { Component, OnInit, Input } from '@angular/core';
import { ListViewBodyDetails, ListViewHeader, ListViewModel, IconsAvailable, IconsColorsAvailable } from 'src/app/core/models/listview.model';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  @Input() listViewItem: ListViewModel;

  listViewHeader: ListViewHeader[] = [];
  listViewBody: ListViewBodyDetails[] = [];
  loading: boolean;

  data: any[] = [];
  originalData: any[] = [];
  optionsToFilterBy: any[] = [];
  dataLoaded: boolean;


  IconsAvailable = IconsAvailable;
  IconsColorsAvailable = IconsColorsAvailable;

  noData: boolean = false;

  //Filtering and Sorting

  filterOptions: any[] = [];
  sortOptions: any[] = [];
  value2: any;
  displayModal: boolean;
  checked2: boolean = true;
  value3: any;
  sortFilterBadge: any = "";
  clearAllFilters: boolean;

  constructor(private apiService: ApiService, private dateService: DateService, private utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
    if (this.listViewItem) {
      this.listViewHeader.push(...this.listViewItem.header);
      this.listViewBody.push(...this.listViewItem.body);
      this.createFilters();
      this.createSortOptions();
      this.getData(this.listViewItem.api, this.listViewItem.query);
    }
  }

  getData(api?: string, query?: ApiQuery) {
    this.apiService.get(api, query).subscribe(data => {
      this.loading = true;
      if (data.length > 0) {
        this.originalData = data;
        this.data = this.originalData;
        this.dataLoaded = true;
        this.loading = false;
      }
      else {
        this.noData = true;
        this.loading = false;
        this.dataLoaded = false;
      }
    }, () => {
      this.loading = false;
      this.dataLoaded = false;
      this.utilitiesService.notifyError('Error loading data');
    });
  }

  createFilters() {
    if (this.listViewHeader[0].filter && this.listViewHeader[0].filter.length > 0) {
      this.filterOptions = this.listViewHeader[0].filter;
    }
  }

  createSortOptions() {
    if (this.listViewHeader[0].sort && this.listViewHeader[0].sort.length > 0) {
      const items = this.listViewHeader[0].sort;
      this.sortOptions = items;
    }
  }

  async handleListClick(args) {
    if (this.listViewHeader[0].customFunction) {
      await this.listViewHeader[0].customFunction(args);
    }
    else {
    }
  }

  filterChange(args, filterField) {
    let temp: any[] = [];
    this.optionsToFilterBy.splice(0);
    for (let x of this.filterOptions) {
      temp.push(...x.filterOptions);
    }

    for (let item of args.value) {
      const fieldFound = temp.filter(x => x.filterBy === item);
      this.optionsToFilterBy.push(...fieldFound);
    }
  }

  clearFilter() {
    this.value2 = [];
    this.optionsToFilterBy = [];
    this.clearAllFilters = true;
  }

  applyFilterSort() {
    let filteredArray: any = [];
    if (this.clearAllFilters) {
      this.data = this.originalData;
      this.sortFilterBadge = "";
    }
    else {
      if (this.optionsToFilterBy.length > 0) {
        for (let item of this.optionsToFilterBy) {
          const filter = this.originalData.filter(x => x[item.filterByField] === item.filterBy);
          filteredArray.push(...filter);
        }
        this.sortFilterBadge = "!";
        this.data = filteredArray;
      }
      else {
        this.sortFilterBadge = "";
        this.data = this.originalData;
      }
    }
    this.displayModal = false;
    this.clearAllFilters = false;
  }

  showModalDialog() {
    this.displayModal = true;
  }

  sortChange(args) {
  }
}
