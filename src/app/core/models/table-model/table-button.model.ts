import { MenuItem } from "primeng/api";

export class TableButton {
    title?: string;
    class?: string;
    place: string;
    icon?: string = "";
    disabled: boolean;
    isUpdate?: boolean;
    items?: MenuItem[];
    customFunction?: (args: any) => Promise<any>;
}

export enum ButtonPlace {
    header = "header",
    footer = "footer",
}

export enum ButtonIcon {
    add = "pi pi-plus",
    delete = "pi pi-trash",
    downloaod = "pi pi-download",
    upload = "pi pi-upload",
    refresh = "pi pi-refresh",
    export = "pi pi-external-link",
    excel = "pi pi-file-excel"
}
 