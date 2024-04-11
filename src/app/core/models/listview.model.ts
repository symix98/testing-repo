import { ApiQuery } from "../miscellaneous/api-query.template";

export enum ListViewPipesTypes {
    User = "UserPipe",
    Status = "Status"
}

export class DynamicIcon {
    iconField?: string;
}

export class DynamicTitle {
    isFieldFromApi?: boolean;
    text?: any;
}

export class ListViewFilter {
    filterBy?: any;
    filterByField?: string;
}

export class ListViewFilterDetails {
    filterTitle?: string;
    filterOptions?: ListViewFilter[];
}

export class ListViewSort {
    label?: any; // label to display
    value?: string; // field to sort by
}

export class ListViewHeader {
    icon?: string;
    dynamicIcon?: DynamicIcon;
    title?: string;
    dynamicTitle?: DynamicTitle[];
    dateField?: string;
    filter?: ListViewFilterDetails[];
    sort?: ListViewSort[];
    customFunction?: (args: any) => Promise<any>;
}

export class ListViewBody {
    caption?: string;
    field?: any;
    referenceMap?: any[]; // reference list to map the retrieved data to
    referenceMapKey?: any; // field name that the filtering will be based on in the reference list
    dataKeyToMap?: any;  // field name from the retrieved data that needs to be mapped
    mappedValueToShow?: any; // field name of the data we want to show from the reference list
    pipeType?: ListViewPipesTypes;
}

export class ListViewBodyDetails {
    row: number;
    body: ListViewBody[];
}

export class ListViewModel {
    header?: ListViewHeader[];
    body?: ListViewBodyDetails[];
    api?: string;
    query?: ApiQuery;
}

export enum IconsAvailable {
    Draft = "pi pi-clock",
    InReview = "pi pi-eye",
    Committed = "pi pi-check",
    Approved = "pi pi-check",
    ToRevise = "pi pi-refresh"
}

export enum IconsColorsAvailable {
    Draft = "darkblue",
    InReview = "#c1946a",
    ToRevise = "#c1946a",
    Committed = "green",
    Approved = "green"
}