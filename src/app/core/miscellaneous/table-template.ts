import { OperatorFunction } from "rxjs";

export interface ITableColumn {
  header: string;
  field: string;
  fieldType: string;
  allowedValues?: any[]
  foreignField?: string;
  foreignDisplayField?: string;
  fieldSearchReference?: string;
  objectReference?: OperatorFunction<any, any>;
  filterable?: boolean;
}

export class FilterButton {
  label: string;
  filterMap?: Map<string, any>;
  notInFilterMap?: Map<string,any>;
}

export enum FieldTypes {
  string = "string",
  boolean = "boolean",
  list = "list",
  number = "number",
  date = "date",
  object = "object"
}

export enum EditMode {
  disabled = "disabled",
  row = "row",
  routeToComponent = "routeToComponent"
}

export enum SelectionMode {
  disabled = "disabled",
  multiple = "multiple",
  single = "single"
}

export enum ToolbarButtons {
  Download,
  Upload,
  Add,
  Remove,
  Import,
  Export,
  Refresh,
  Assign
}
