export class DataViewField {
    caption?: string;
    fieldName?: string;
    order?: number; //1 if after the field name result, -1 if before the field name result
    dataFromDetails?: boolean;
    detailFieldName?: string;
    referenceMap?: any;
    referenceMapKey?: string;
    mappedValueToShow?: string;
}

export class DataViewContent {
    row?: number;
    fieldsToMap?: string[]; //name of the fields we want to use from API
    index?: number;
    separator?: string;
    fields?: Map<string, any[]>;
    dataViewFields?: DataViewField[];
    calculatedField?: boolean; //it's going to be the length
    fieldToCalculateOn?: string; // the field we want to calculate the length on
}

