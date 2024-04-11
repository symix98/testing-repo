export class TableFilter {
    filterType: string;
    filterName: string;
    listUrl?: string;
    listPrimaryKey?: string;
    listDisplayKey?: string;
    localList?: boolean;
}

export enum FilterType {
    date_bigger_than = "date-bigger-than",
    date_less_than = "date-less-than",
    date_default = "date-default",
    date_equals = "date-equals",
    number = "number",
    string = "string",
    boolean = "boolean",
    list = "list",
    date_time= "date-time"
}