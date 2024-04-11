import { FilterButton } from "src/app/core/miscellaneous/table-template";
//import { FormType } from "../../miscellaneous/global-props.template";
import { DataViewContent } from "./dataview-content.model";
import { DataViewRowTitle } from "./dataview-row-title.model";
import { ProductParameter } from "./product-parameter.model";

export class DataViewParameter {
    dataKey?: string;
    paginator?: boolean = true;
    api: string;
    redirectUrl?: string;
    defaultFilter?: Map<string, any>;
    quickFilters?: FilterButton[];
    onRowSelected?: (args: any) => any
    rowPerPageDefault: number;
    sortOrder?: number;
    sort?:string;
    //dataViewType?: FormType;
    productsCard ?: ProductParameter;
    filterBox ?: {
        label: string,
        field:string[]
    }
    dataViewRowTitle?: DataViewRowTitle;
    dataViewContent?: DataViewContent[];
}
