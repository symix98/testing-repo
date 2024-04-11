import { ApiQuery } from "../../miscellaneous/api-query.template";
import { FilterButton } from "../../miscellaneous/table-template";
import { ISecurityButton } from "../security-model/security-component.model";
import { TableButton } from "./table-button.model";
import { TableColumn } from "./table-column.model";

export class TableParameter {
    dataKey: string = 'id';
    paginator?: boolean = true;
    searchable?: boolean = true;
    advancedSearch?:boolean = false;
    showTableCaption?: boolean = true;
    inDialog?: boolean = false;
    queryParams?: ApiQuery;
    columns: TableColumn[] = [];
    buttons: ISecurityButton[] = [];
    editMode?: string;
    selectionMode?: string;
    api: string;
    redirectUrl?: string;
    defaultFilter?: Map<string, any>;
    quickFilters?: FilterButton[];
    rowEdit?: (args: any) => Promise<any>;
    rowDelete?: (args: any) => Promise<any>;
    onRowSelected?: (args: any) => any
    onCheckBoxSelected?: (args: any) => any
    rowPerPageDefault:number;
    sort?:string;
    alwaysShowAdvanced: boolean = false;
    withCache: boolean = false;
    showToggler:boolean = false;
    expand:boolean = false
    expandComponent?:any
    expandData?:any
    scrollHeight:string = "flex"
    filterName:string="QUICK FILTERS:"
}

export enum editMode {
    redirect = "redirect",
    inplace = "inplace",
    inMemory = "inMemory"
}

export enum selectionMode {
    mulitple = "mulitple",
    single = "single",
}
