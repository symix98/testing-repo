import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { OperatorFunction, Subscription } from 'rxjs';
import { FilterButton } from 'src/app/core/miscellaneous/table-template';
import { ButtonPlace, TableButton } from 'src/app/core/models/table-model/table-button.model';
import { FieldType, TableColumn } from 'src/app/core/models/table-model/table-column.model';
import { TableFunctionArgument } from 'src/app/core/models/table-model/table-function-argument';
import { editMode, selectionMode, TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { ApiService } from 'src/app/core/services/api.service';
import { DateService } from 'src/app/core/services/date.service';
import { SecurityService } from 'src/app/core/services/security.service';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { FilterType } from './modules/table-filter.module';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.scss']
})

export class TableTemplateComponent implements OnInit, OnDestroy {

  @ViewChildren('dynamicInsert', { read: ViewContainerRef }) dynamicInsert: QueryList<ViewContainerRef>;
  @ViewChildren('dynamicInsert1', { read: ViewContainerRef }) dynamicInsert1: QueryList<ViewContainerRef>;
  @ViewChildren('dynamicInsert2', { read: ViewContainerRef }) dynamicInsert2: QueryList<ViewContainerRef>;
  @ViewChildren('dynamicInsert3', { read: ViewContainerRef }) dynamicInsert3: QueryList<ViewContainerRef>;
  @ViewChildren('dynamicInsert4', { read: ViewContainerRef }) dynamicInsert4: QueryList<ViewContainerRef>;
  @ViewChild('dt') table: Table;
  @ViewChild('op') columnFilterOverlayPanel: OverlayPanel;

  // Enums used in html
  public editModes = editMode;
  public selectionModes = selectionMode;

  // Table Parameter
  @Input() tableParam: TableParameter;
  @Input() editable?: boolean = true;
  subscriptions = new Subscription();

  predicate!: string;
  selectedObjects: any[] = [];
  storedSelectedObjects: any[] = [];

  objectList: any[]; // Filter List got through API
  selectedList: any[]; // Selected Elements From Filter List

  editedObjects: { [s: string]: any; };
  addedObject: any;
  data: any[];
  loading: boolean;
  totalItems = 0;
  rows: number;
  page!: number;
  ascending!: boolean;
  activeQuickFilter: FilterButton;
  filterColumnValues: { value: string }[];
  selectedfilterColumnValues: { value: string }[];
  activeColumnFilter: string;

  headerButtons: TableButton[] = [];
  footerButtons: TableButton[] = [];

  showAdvancedSearch: boolean = false;

  searchVals: any[] = [];
  filterCol: TableColumn; // Selected Filter Column

  stringFilterCol: TableColumn;
  stringFilter: string;
  selectedCols:TableColumn[]
  colOptions:TableColumn[]
  objectStringFilterCol: TableColumn;
  objectStringFilter: string;

  yearRange = `${new Date().getFullYear() - 50}:${new Date().getFullYear() + 10}`;
  stateOptions: any[] = [
    { label: 'Single Date', value: false },
    { label: 'Range', value: true },
  ];
  stateOptions1: any[] = [
    { label: 'Range', value: true },
  ];

  range: boolean = false; // Apply Range In Date Filter
  dateRange: Date[] = []; // Selected Ranges From Date Picker

  firstRun: boolean = true;

  constructor(
    private securityService: SecurityService,
    private utilities: UtilitiesService,
    private apiService: ApiService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dateService: DateService,
    private router: Router,
    private cdf: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initButtons();
    this.loading = true;
    this.colOptions = this.tableParam.columns?.filter(col => !col.isOption);
    this.selectedCols = this.tableParam.columns?.filter(col => !col.isHide);
    this.rows = this.tableParam.rowPerPageDefault ? this.tableParam.rowPerPageDefault : 15;
    this.showAdvancedSearch = this.tableParam.alwaysShowAdvanced;
    
  }

  ngOnDestroy() {
    let savedFilter: any = sessionStorage.getItem('table-filter');
    if (savedFilter && !JSON.parse(savedFilter).filters) {
      this.clearFilters();
    }
    this.subscriptions.unsubscribe();
  }

  clearFilters() {
    sessionStorage.clear();
    this.tableParam.columns.forEach(col => {
      if (col.filter)
        this.table.filter('', col.filter.filterName, 'contains')
    });
  }
  refresh(){
    this.clearFilters();
  }
  initButtons() {
    this.tableParam.buttons.forEach(button => {
      if (button.entity)
        button.hasPermission = this.securityService.hasPermissions(button.entity, button.action)

      if (button.place == ButtonPlace.header) {
        this.headerButtons.push(button);
      }
      else if (button.place == ButtonPlace.footer) {
        this.footerButtons.push(button);
      }
    });
  }

  trackByIndex(index: number): any {
    return index;
  }

  paginate(event: LazyLoadEvent, table: Table) {
    // if(this.tableParam.withCache){
    if (this.firstRun && this.tableParam.withCache) {
      let cached = this.getCachedCustomFilters();
      if (cached) {
        if (cached.filters.length > 0) {
          this.showAdvancedSearch = true;
          for (let filter of cached.filters) {
            table.filter(filter.value, filter.col, filter.matchMode);
          }
        }

        this.predicate = cached.sortField;
        this.ascending = cached.sortOrder == 1 ? true : false;
        this.rows = cached.rows;
        this.page = cached.page / cached.rows + 1;
        table.sortField = cached.sortField;
        table.sortOrder = cached.sortOrder;
        table.rows = cached.rows;
        table.first = cached.page;

        this.firstRun = false;
        this.cdf.detectChanges();
      }
      else {

        //  this.setCachedFilters(null, event.rows, event.sortField, event.sortOrder, event.first);

        this.predicate = event.sortField;
        this.ascending = event.sortOrder === 1 ? true : false;
        this.rows = event.rows;
        this.page = event.first / event.rows + 1;
      }
    }
    else {
      //this.setCachedFilters(null, event.rows, event.sortField, event.sortOrder, event.first);

      this.predicate = event.sortField;
      this.ascending = event.sortOrder === 1 ? true : false;
      this.rows = event.rows;
      this.page = event.first / event.rows + 1;
    }
    // } 
    // else if(event.sortField || event.rows) {
    //   this.setCachedFilters(null, event.rows, event.sortField, event.sortOrder, event.first);

    //   this.predicate = event.sortField;
    //   this.ascending = event.sortOrder === 1 ? true : false;
    //   this.rows = event.rows;
    //   this.page = event.first / event.rows + 1;
    // }
    this.loadPage();
  }

  editInit(object: any) {
    if (!this.editedObjects)
      this.editedObjects = {}
    this.editedObjects[object[this.tableParam.dataKey]] = { ...object };
  }

  cancelEdit(object: any, index: number) {
    if (object.new) {
      this.addedObject = null;
      this.table.value.shift();
      this.table.cancelRowEdit(object);
    }
    else {
      this.data[index] = this.editedObjects[object[this.tableParam.dataKey]];
      delete this.editedObjects[object[this.tableParam.dataKey]];
      if (Object.keys(this.editedObjects).length == 0)
        this.editedObjects = undefined
    }
  }

  getForeignFieldDisplayValue(object: any, foreignColumn: TableColumn) {
    let allowedValues = foreignColumn.arrayList ? foreignColumn.arrayList : foreignColumn.map.get(object[foreignColumn.mapKeyField]);
    let foreignFieldValue = object[foreignColumn.field]?.[foreignColumn.foreignField]
      ? object[foreignColumn.field][foreignColumn.foreignField]
      : object[foreignColumn.field];

    let foreignObject = allowedValues ? allowedValues.find(x => x[foreignColumn.foreignField] === foreignFieldValue) : null;
    return foreignObject ? foreignObject[foreignColumn.foreignDisplayField] : object[foreignColumn.field];
  }

  getNestedObject(object: any, func: OperatorFunction<any, any>) {
    return func(object);
  }

  getStyle(object: any, func: OperatorFunction<any, any>): string {
    let style: string = '';
    if (func)
      func(object).subscribe((val) => style = val)
    return style;
  }

  setNestedObject(object: any, field: string, value: any) {
    let arr = field.split('.')
    object[arr[0]][arr[1]] = value;
  }

  selectAll(event) {
    if (event.checked) {
      this.selectedObjects.forEach(element => {
        const index = this.storedSelectedObjects.findIndex(x => JSON.stringify(x) == JSON.stringify(element));
        if (index < 0) {
          this.storedSelectedObjects.push(element);
        }
      })
    } else {
      this.storedSelectedObjects = []
    }
  }

  rowSelected(event: any) {
    this.storedSelectedObjects.push(event.data);
    this.tableParam.onCheckBoxSelected? this.tableParam.onCheckBoxSelected({ selected: this.storedSelectedObjects }) : null
    if (this.tableParam.selectionMode == this.selectionModes.single && this.tableParam.onRowSelected) {
      this.tableParam.onRowSelected({ selected: event.data });
    }
  }

  rowUnselected(event: any) {
    let index;
    index = this.storedSelectedObjects.findIndex(x => x[this.tableParam.dataKey] == event.data[this.tableParam.dataKey]);
    if (index >= 0) {
      this.storedSelectedObjects.splice(index, 1);
    }
    this.tableParam.onCheckBoxSelected? this.tableParam.onCheckBoxSelected({ selected: this.storedSelectedObjects }) : null
  }

  rowClicked(event: any, data: any) {
    if (window.getSelection().type != 'Range' && this.tableParam.inDialog != true && this.tableParam.selectionMode == this.selectionModes.mulitple && !this.addedObject && this.tableParam.onRowSelected != null && (!event.target.classList.contains('p-checkbox-box') && !event.target.classList.contains('p-checkbox-icon'))) {
      this.tableParam.onRowSelected({ selected: data });
    }
  }

  quickFilter(activeFilter: FilterButton) {
    this.activeQuickFilter = this.activeQuickFilter?.label === activeFilter.label ? null : activeFilter;
    //  this.table.reset();
    this.loadPage();
  }

  showColumnFilterPanel(event: MouseEvent, colField: string) {
    let url: string = this.tableParam.api + '/distinct' + colField.charAt(0).toUpperCase() + colField.slice(1);
    this.subscriptions.add(this.apiService.get(url).subscribe((filterValues) => {
      this.filterColumnValues = filterValues.map((value: string) => {
        return {
          value: value ? value : '(empty)'
        };
      })
      if (this.activeColumnFilter != colField) {
        this.activeColumnFilter = colField;
        this.selectedfilterColumnValues = null;
      }
      this.columnFilterOverlayPanel.show(event);
    }));
  }

  applyColumnFilter() {
    this.loadPage();
  }

  search(searchValue: string) {
    let oldValue = this.table.filters['global']
    if (oldValue !== searchValue) {
      this.activeQuickFilter = null;
      this.activeColumnFilter = null;
      this.table.filterGlobal(searchValue, 'contains');
    }
  }

  private onSuccess(data: any[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.data = data || [];
    this.CheckSelectedAndConvertDate();
    setTimeout(() => {
      const dynamicRefArr = this.dynamicInsert.toArray();
      for (let i = 0; i < this.data.length; i++) {
        const index = this.tableParam.columns.findIndex(x => x.fieldType == FieldType.component);
        if (index >= 0) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.columns[index].specialColumn);
          dynamicRefArr[i].clear();
          const dynamicComponent = <any>dynamicRefArr[i].createComponent(componentFactory).instance;
          dynamicComponent.data = this.data[i];
        }
      }
    }, 150);
    setTimeout(() => {
      const dynamicRefArr = this.dynamicInsert1.toArray();
      for (let i = 0; i < this.data.length; i++) {
        const index = this.tableParam.columns.findIndex(x => x.fieldType == "component1");
        if (index >= 0) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.columns[index].specialColumn);
          dynamicRefArr[i].clear();
          const dynamicComponent = <any>dynamicRefArr[i].createComponent(componentFactory).instance;
          dynamicComponent.data = this.data[i];
        }
      }
    }, 150);
    setTimeout(() => {
      const dynamicRefArr = this.dynamicInsert2.toArray();
      for (let i = 0; i < this.data.length; i++) {
        const index = this.tableParam.columns.findIndex(x => x.fieldType == "component2");
        if (index >= 0) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.columns[index].specialColumn);
          dynamicRefArr[i].clear();
          const dynamicComponent = <any>dynamicRefArr[i].createComponent(componentFactory).instance;
          dynamicComponent.data = this.data[i];
        }
      }
    }, 150);
    setTimeout(() => {
      const dynamicRefArr = this.dynamicInsert3.toArray();
      for (let i = 0; i < this.data.length; i++) {
        const index = this.tableParam.columns.findIndex(x => x.fieldType == "component3");
        if (index >= 0) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.columns[index].specialColumn);
          dynamicRefArr[i].clear();
          const dynamicComponent = <any>dynamicRefArr[i].createComponent(componentFactory).instance;
          dynamicComponent.data = this.data[i];
        }
      }
    }, 150);
   
  }

  onRowExpand(e){
 setTimeout(() => {
  
      // const dynamicRefArr = this.dynamicInsert4.toArray();
      // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.columns[0].specialColumn);
      // const dynamicComponent = <any>dynamicRefArr[0].createComponent(componentFactory).instance;
      let dynamicRefArr = this.dynamicInsert4.toArray();


    // Create a factory for the dynamic component
    let factory = this.componentFactoryResolver.resolveComponentFactory(this.tableParam.expandComponent);

    // Create an instance of the dynamic component
    let dynamicComponent = dynamicRefArr[dynamicRefArr.length - 1].createComponent(factory);

      let dynamicComponentInstance = <any>dynamicComponent.instance;
  
      // You can also pass inputs to the component if needed
      dynamicComponentInstance.data = {
        isExpand:true,
        customData: this.tableParam.expandData,
        row : e.data
      }

    }, 150);
  }

  public loadPage(): void {
    this.loading = true;

    this.selectedObjects = [];
    const pageToLoad: number = this.page || 1;


    let greaterThan;
    let lessThan;
    let params;

    if (this.tableParam.queryParams) {
      greaterThan = this.tableParam.queryParams.greaterThan;
      lessThan = this.tableParam.queryParams.lessThan;
      params = this.tableParam.queryParams.params;
    }

    let queryParams = {
      page: pageToLoad - 1,
      size: this.rows,
      sort: this.sort(),
      advancedSearch: this.table?.filters,
      search: this.getGlobalFilters(),
      filter: this.getFilters(),
      notInFilter: this.getNotInFilters(),
      greaterThan: greaterThan,
      lessThan: lessThan,
      params: params
    };
    this.apiService.get(this.tableParam.api, queryParams, true).subscribe((res: HttpResponse<any[]>) => {
      this.onSuccess(res.body, res.headers, pageToLoad);
      this.loading = false;
    }, () => {
      this.utilities.notifyError("Failed to load data")
      this.loading = false;
    });
  }

  private getGlobalFilters(): Map<string, any> {
    let map: Map<string, any>;
    if (this.table?.filters.global) {
      map = new Map<string, any>();
      this.tableParam.columns.filter(col => col.fieldType === FieldType.string || col.fieldType === FieldType.object).forEach(col => {
        let searchValue = this.table.filters.global['value'];
        map.set(col.fieldSearchReference ? col.fieldSearchReference : col.field, searchValue);
      });
    }

    if (this.activeColumnFilter && this.selectedfilterColumnValues) {
      map = map ? map : new Map<string, any>();
      var filterValues = this.selectedfilterColumnValues.map(function (x) {
        return x.value === '(empty)' ? null : x.value;
      });
      map.set(this.activeColumnFilter, filterValues);
    }
    return map;
  }

  private getFilters(): Map<string, any> {
    let filterMap: Map<string, any>;
    if (this.tableParam.defaultFilter) {
      filterMap = this.tableParam.defaultFilter;
    }
    if (this.activeQuickFilter && this.activeQuickFilter.filterMap) {
      filterMap = new Map<string, any>();
      for (let [key, value] of this.activeQuickFilter.filterMap) {
        filterMap.set(key, value);
      }
    }
    return filterMap;
  }

  private getNotInFilters(): Map<string, any> {
    let filterMap: Map<string, any>;
    if (this.activeQuickFilter && this.activeQuickFilter.notInFilterMap) {
      filterMap = new Map<string, any>();
      for (let [key, value] of this.activeQuickFilter.notInFilterMap) {
        filterMap.set(key, value);
      }
    }
    return filterMap;
  }

  private sort(): string[] {
    const sortArray: string[] = [];
    if (this.predicate) {
      sortArray.push(this.predicate + ',' + (this.ascending ? 'asc' : 'desc'));
    }
    if (!this.tableParam.sort) {
      if (this.predicate !== this.tableParam.dataKey) {
        sortArray.push(this.tableParam.dataKey);
      }
    } else {
      sortArray.push(this.tableParam.sort)
    }
    return sortArray;
  }

  private CheckSelectedAndConvertDate() {
    this.data.forEach(element => {
      this.tableParam.columns.forEach(tableCol => {
        if (tableCol.fieldType == 'date' && element[tableCol.field])
          element[tableCol.field] = new Date(element[tableCol.field])
      })
      const index = this.storedSelectedObjects.findIndex(x => JSON.stringify(x) == JSON.stringify(element));
      if (index >= 0) {
        this.selectedObjects.push(this.data[index]);
      }
    });
  }

  async handleButtonClick(button: TableButton) {
    this.loading = true;
    let args: TableFunctionArgument = new TableFunctionArgument();
    args.api = this.tableParam.api;
    args.selectedObjects = this.storedSelectedObjects;
    args.table = this.table;
    args.data = this.data;
    args.dataKey = this.tableParam.dataKey;

    const newArgs: TableFunctionArgument = await button.customFunction(args);
    this.loading = false;

    if (newArgs) {
      if (newArgs.refresh) {
        this.storedSelectedObjects = [];
        this.selectedObjects = [];
        this.loadPage();
      }
      else if (newArgs.addedObject != this.addedObject) {
        this.storedSelectedObjects = [];
        this.selectedObjects = [];
        this.addedObject = newArgs.addedObject;
      }
    }
  }

  async handleRowClick(object: any, deleteFx: boolean) {
    this.loading = true;
    let dataKey = this.tableParam.dataKey;
    if (deleteFx) {
      let selected = [];
      selected.push(object);
      let args: TableFunctionArgument = new TableFunctionArgument();
      args.api = this.tableParam.api;
      args.table = this.table;
      args.dataKey = dataKey;
      args.selectedObjects = selected;
      await this.tableParam.rowDelete(args);
    }
    else {
      let pKey = object[dataKey]
      let newKey = this.addedObject ? this.addedObject[dataKey] : null
      let compositeKey = dataKey.split('.')
      if (compositeKey.length > 1) {
        pKey = object[compositeKey[0]] ? object[compositeKey[0]][compositeKey[1]] : null;
        newKey = this.addedObject && this.addedObject[compositeKey[0]] ? this.addedObject[compositeKey[0]][compositeKey[1]] : null
      }
      let isNew = object.new;
      if (!pKey && isNew)
        object[dataKey] = newKey

      let errorMessage = undefined;
      await this.validateForm(object, isNew).then((error) => {
        if (error) {
          errorMessage = error;
        }
      })
      if (errorMessage) {
        this.utilities.notifyError(errorMessage)
        this.table.initRowEdit(object);
        this.loading = false;
        return;
      }

      await this.tableParam.rowEdit({ object: object, new: isNew });
      if (isNew) {
        object.new = false;
        this.addedObject = null;
        this.totalItems += 1;
      }
      else {
        delete this.editedObjects[pKey];
        if (Object.keys(this.editedObjects).length == 0)
          this.editedObjects = undefined
      }
    }
    this.loading = false;
    if (!editMode.inMemory)
      this.loadPage();
  }

  async validateForm(object: any, isNew: boolean): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (isNew) {
        this.validateKeyUniqueness().then((errorKey) => {
          if (errorKey) {
            object[this.tableParam.dataKey] = undefined
            resolve(errorKey)
          }
          else
            this.validateRequiredFields(object, isNew).then((errorForm) => {
              resolve(errorForm)
            })
        })
      }
      else
        this.validateRequiredFields(object, isNew).then((errorForm) => {
          resolve(errorForm)
        })
    })
  }

  validateRequiredFields(object: any, isNew: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      this.tableParam.columns.forEach(col => {
        let colField = col.field;
        let isKeyField = colField === this.tableParam.dataKey
        if (col.required && !(object[colField] || (col.fieldType == FieldType.object && this.getNestedObject(object, col.objectReference))) && !(isNew && isKeyField))
          resolve("Fill in the required field")
      })
      resolve(undefined)
    })
  }

  validateKeyUniqueness(): Promise<string> {
    return new Promise((resolve, reject) => {
      let edited = false;
      this.tableParam.columns.forEach(col => {
        if (col.field == this.tableParam.dataKey && !col.editDisabled)
          edited = true;
      })

      if (edited) {
        let newKey: string = this.addedObject[this.tableParam.dataKey]
        if (!newKey)
          resolve("Fill in the required fields")
        this.apiService.get(this.tableParam.api, newKey).subscribe((res) => {
          resolve(this.utilities.capitalize(this.tableParam.dataKey) + ': ' + newKey + " already exists");
        }, () => resolve(undefined)
        )
      } else {
        resolve(undefined)
      }
    })
  }
  // Set Cached Filters
  //--------------------------------
  setCachedFilters(passedFilters: any, passedRows: number, passedSortField: any, passedSortOrder: any, passedPage: number) {
    let savedFilter: any = sessionStorage.getItem('table-filter');
    let filters: any[] = [];
    let filter: any = {};
    let rows: number;
    let sortField: any;
    let sortOrder: any;
    let page: number;

    let cachedFilter: any = {};

    if (savedFilter && JSON.parse(savedFilter).route == this.router.url) {
      filters = JSON.parse(savedFilter).filters;
      rows = JSON.parse(savedFilter).rows;
      sortField = JSON.parse(savedFilter).sortField;
      sortOrder = JSON.parse(savedFilter).sortOrder;
      page = JSON.parse(savedFilter).page;
    }
    else {
      sessionStorage.clear();
    }

    if (passedFilters) {
      filter = { value: passedFilters.value, col: passedFilters.col, matchMode: passedFilters.matchMode };
      filters.push(filter);
    }

    rows = passedRows == null ? rows : passedRows;
    sortField = passedSortField == null ? sortField : passedSortField;
    sortOrder = passedSortOrder == null ? sortOrder : passedSortOrder;
    page = passedPage == null ? page : passedPage;

    cachedFilter.filters = filters;
    cachedFilter.route = this.router.url;
    cachedFilter.rows = rows;
    cachedFilter.sortField = sortField;
    cachedFilter.sortOrder = sortOrder;
    cachedFilter.page = page;

    sessionStorage.setItem('table-filter', JSON.stringify(cachedFilter));
  }

  // Apply Custom Filter
  //--------------------------------
  applyCustomFilter(value: any, col: string, matchMode: string) {
    this.setCachedFilters({ value: value, col: col, matchMode: matchMode }, null, null, null, null);
    this.table.filter(value, col, matchMode);
  }
  //--------------------------------

  // List Filter
  //--------------------------------
  applyListFilter() {
    this.applyCustomFilter(this.selectedList, this.filterCol.filter.filterName, 'list');
  }
  //--------------------------------

  // Boolean Filter
  //--------------------------------
  applyBooleanFilter(value: boolean) {
    this.applyCustomFilter(value, this.filterCol.filter.filterName, 'check');
  }

  // Date Filter
  //--------------------------------
  applyDateFilter() {
    this.activeQuickFilter = null;

    if (this.filterCol.filter.filterType == FilterType.date_default) {
      if (this.range) {
        this.applyCustomFilter([this.dateService.systemDateFormat(this.dateRange[0]), this.dateService.systemDateFormat(this.dateRange[1])], this.filterCol.filter.filterName, 'between')
      }
      else {
        this.applyCustomFilter(this.dateService.systemDateFormat(this.dateRange[0]), this.filterCol.filter.filterName, 'equals');
      }
    }
    else if (this.filterCol.filter.filterType == FilterType.date_time) {
      if (this.range) {
        this.applyCustomFilter([this.dateRange[0].toISOString(), this.dateRange[1].toISOString()], this.filterCol.filter.filterName, 'between')
      }
      else {
        this.applyCustomFilter(this.dateRange[0].toISOString(), this.filterCol.filter.filterName, 'equals');
      }
    }
    else if (this.filterCol.filter.filterType == FilterType.date_bigger_than) {
      this.applyCustomFilter(this.dateService.systemDateFormat(this.dateRange[0]), this.filterCol.filter.filterName, 'greaterThanOrEqual');
    }
    else if (this.filterCol.filter.filterType == FilterType.date_less_than) {
      this.applyCustomFilter(this.dateService.systemDateFormat(this.dateRange[0]), this.filterCol.filter.filterName, 'lessThanOrEqual');
    }
    else if (this.filterCol.filter.filterType == FilterType.date_equals) {
      this.applyCustomFilter(this.dateService.systemDateFormat(this.dateRange[0]), this.filterCol.filter.filterName, 'equals');
    }
  }

  // String Filter
  //--------------------------------
  searchCol(value: string) {
    this.activeQuickFilter = null;
    let matchMode;

    let regex = this.searchVals.indexOf("regex-" + this.filterCol.filter.filterName) !== -1;
    let not = this.searchVals.indexOf("not-" + this.filterCol.filter.filterName) !== -1;
    if (not) {
      matchMode = 'doesNotContain';
    } else {
      matchMode = regex || this.filterCol.filter.filterType == FilterType.number ? 'equals' : 'contains';
    }
    this.applyCustomFilter(value, this.filterCol.filter.filterName, matchMode);
  }

  //--
  //--------------------------------

  // Table Filter
  //--------------------------------
  setFilterCol(col: TableColumn) {
    
    if (col.filter.filterType == FilterType.list) {
      const arr: any = this.table.filters[col.filter.filterName];
      this.objectList = null;
      arr == null ? this.selectedList = null : this.selectedList = arr.value;

      if (col.filter.localList) {
        this.objectList = col.arrayList;
      }
      else {
        this.subscriptions.add(this.apiService.get(col.filter.listUrl, null, false).subscribe((data) => {
          this.objectList = data;
        }));
      }
    }
    else if (col.filter.filterType.includes('date')) {
      this.dateRange = [];
      this.range = false;
      const filter: any = this.table.filters[col.filter.filterName];
      if (filter) {
        let value: any = filter.value;
        let arr: Date[] = [];

        if (value instanceof Array) {
          this.range = true;
          arr.push(new Date(value[0]));
          arr.push(new Date(value[1]));
        }
        else {
          this.range = false;
          arr.push(new Date(value));
        }
        this.dateRange = arr;
      }
    }
    if(col.filter.filterType == FilterType.date_time){
      this.range = true
    }

    this.filterCol = col;
  }
  //--------------------------------
  getCachedCustomFilters(): any {
    let savedFilter: any = sessionStorage.getItem('table-filter');

    if (savedFilter && JSON.parse(savedFilter).route == this.router.url) {
      return JSON.parse(savedFilter);
    }
    else {
      sessionStorage.clear();
      return null;
    }
  }
  //--------------------------------
}