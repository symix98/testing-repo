import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ApiQuery } from 'src/app/core/miscellaneous/api-query.template';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { FilterButton } from 'src/app/core/miscellaneous/table-template';
import { DataViewParameter } from 'src/app/core/models/data-view-model/dataview-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';

@Component({
  selector: 'app-products-dataview',
  templateUrl: './products-dataview.component.html',
  styleUrls: ['./products-dataview.component.scss']
})
export class ProductsDataviewComponent implements OnInit {
  @ViewChild('dv') table: DataView;
  @Input() dataViewParam: DataViewParameter;

  productfamiles: any[] = []
  productList: any[] = []
  classnameResult: any[] = []
  classifyResults: any[]
  filterFamilyCode: string = ""
  productdesc: String = ""
  productfamily: any
  productclassify: any
  isPageLoading: Boolean = false;
  selectedFilter:string
  data: any[];
  loading: boolean;
  activeQuickFilter: FilterButton;

  predicate!: string;
  ascending!: boolean;
  rows: number;
  page!: number;
  totalItems: number;
  searchBox: string = ""
  //IconsAvailable = IconsAvailable;

  constructor(private utilities: UtilitiesService,
              private apiService: ApiService,
              private dateService: DateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.rows = this.dataViewParam.rowPerPageDefault ? this.dataViewParam.rowPerPageDefault : 10;

    // this.loadProductFamily(false);
  }

  loadData(event: LazyLoadEvent) {
    this.predicate = event.sortField || this.dataViewParam.dataKey;
    this.ascending = event.sortOrder === 1 ? true : false;
    this.rows = event.rows;
    this.page = event.first / event.rows + 1;
    this.getData();
  }

  getData() {
    let e = this.searchBox
    this.loading = true;
    const pageToLoad: number = this.page || 1;

    let queryParams = {
      page: pageToLoad - 1,
      size: this.rows,
      sort: this.sort(),
      contains: new Map<any, any>([[this.selectedFilter, e]])
    };

    this.apiService.get(this.dataViewParam.api, queryParams, true).subscribe((res: HttpResponse<any[]>) => {
      this.onSuccess(res.body, res.headers, pageToLoad);
      this.loading = false;
    }, () => {
      this.utilities.notifyError("Failed to load data")
      this.loading = false;
    });
  }

  private onSuccess(data: any[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.data = data || [];
  }

  quickFilter(activeFilter: FilterButton) {
    this.activeQuickFilter = this.activeQuickFilter?.label === activeFilter.label ? null : activeFilter;
    this.getData();
  }

  private sort(): string[] {
    const sortArray: string[] = [];
    if (!this.dataViewParam.sort) {
    if (this.predicate) {
      sortArray.push(this.predicate + ',' + (this.ascending ? 'asc' : 'desc'));
    }
    if (this.predicate !== this.dataViewParam.dataKey) {
      sortArray.push(this.dataViewParam.dataKey);
    }
  }else{
      sortArray.push(this.dataViewParam.sort)
    }
    return sortArray;
  }

  private getFilters(): Map<string, any> {
    let filterMap = new Map<string, any>();
    if (this.dataViewParam.defaultFilter && !this.activeQuickFilter) {
      filterMap = this.dataViewParam.defaultFilter;
    }
    if (this.dataViewParam.defaultFilter && (this.activeQuickFilter && this.activeQuickFilter.filterMap)) {
      for (let [key, value] of this.dataViewParam.defaultFilter) {
        filterMap.set(key, value);
      }
      for (let [key, value] of this.activeQuickFilter.filterMap) {
        filterMap.set(key, value);
      }
    }
    if (this.activeQuickFilter && this.activeQuickFilter.filterMap) {
      for (let [key, value] of this.activeQuickFilter.filterMap) {
        filterMap.set(key, value);
      }
    }
    return filterMap;
  }

  searchByName(e) {
    this.searchBox = e
    this.getData()
  }
  changedField(e){
    this.getData()
  }

}
