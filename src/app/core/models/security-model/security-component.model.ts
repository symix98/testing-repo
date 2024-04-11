import { TableButton } from "../table-model/table-button.model";
import { SecurityAction } from "./security-action.model";
import { SecurityEntity } from "./security-entity.model";

export interface ISecurityButton extends TableButton{
    action?: SecurityAction;
    entity?: SecurityEntity[];
    hasPermission?:boolean;
}
