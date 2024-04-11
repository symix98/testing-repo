import { FilterMetadata } from "primeng/api";

export class ApiQuery {
    page?: number;
    size?: number;
    sort?: string[];
    filter?: any;
    notInFilter?: any;
    search?: any;
    contains?:any;
    advancedSearch?: {[s: string]: FilterMetadata | FilterMetadata[]};
    findNull?: string[];
    greaterThan?: any;
    lessThan?: any;
    scheduleId?: string;
    fromDate?: any;
    toDate?: any;
    params?: any;
}