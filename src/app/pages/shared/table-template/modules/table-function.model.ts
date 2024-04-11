import { Table } from 'primeng/table';

export class TableFunctionArgument {
    api: string;
    table: Table;
    data: any[];
    addedObjects: any[];
    selectedObjects: any[];
    refresh: boolean;
    redirect: string;
    dataKey: any;
    selected: any;
}