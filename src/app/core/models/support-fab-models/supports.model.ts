import { SupportDetailsModel } from "./support/SupportDetails.model";
import { SupportLocationModel } from "./support/SupportLocation.model";
import { SupportParentsModel } from "./support/SupportParent.model";
import { SupportStatusModel } from "./support/SupportStatus.model";

export class SupportsModel {
    id?: Number;
    isDetailed?: Boolean;
    support?: String;
    suppItem? :String;
    supStatus?: String;
    supStDes? :String;
    supStGRP? :String;
    suppPnt?: String;
    subWT?: Number;
    othWT? :Number;
    supWT? :Number;
    supTAG?: String;
    rsfNo? :String;
    supportDetails?: SupportDetailsModel;
    supportLocation?: SupportLocationModel;
    supportParents?: SupportParentsModel;
    supportStatuses?: SupportStatusModel;
}