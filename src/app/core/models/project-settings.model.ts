export enum ValueType {
    stringType = "StringType",
    numberType = "NumberType",
    dateType = "DateType",
    booleanType = "BooleanType",
    weldType = "WeldType",

}

export class ProjectSettings {
    id?: number;
    property?: string;
    description?: string;
    value?: string;
    valueType?: ValueType;
    category?: string;
    isMultiple?: boolean;
}