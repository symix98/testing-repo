import { OperatorFunction } from "rxjs";
import { TableFilter } from "src/app/pages/shared/table-template/modules/table-filter.module";

export class TableColumn {
    title: string;
    field: string;
    fieldType: string;
    width?: string;
    filterable?: boolean = false;
    disableSort?: boolean = false;
    editDisabled?:boolean = false;
    objectReference?: OperatorFunction<any, any>;
    fieldSearchReference?: string;
    specialColumn?: any;
    arrayList?: any[];
    map?: Map<string, any[]>;
    mapKeyField?:string;
    foreignField?: string;
    foreignDisplayField?: string;
    required?: boolean;
     filter?: TableFilter;
    min?:number;
    style?:OperatorFunction<any, any>;
    max?:number;
    isHide?:boolean = false;
    isOption?:boolean = false
}

export enum FieldType {
    string = "string",
    boolean = "boolean",
    list = "list",
    number = "number",
    date = "date",
    object = "object",
    component = "component",
    component1 = "component1",
    map = "map"
}