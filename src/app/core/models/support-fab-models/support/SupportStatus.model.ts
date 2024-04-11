import { SupportsModel } from "../supports.model";
import { SupportHeadersModel } from "./SupportHeaders.model";

export class SupportStatusModel{
    id?: Number;
    status?: String;
    satatusName?:String;
    modifyDate?: Date;
    modifyBy?: String;
    isSubcontractor?: Boolean;
    isCCC?: Boolean;
    weight?: Number;
    supportHeaders:SupportsModel
    }