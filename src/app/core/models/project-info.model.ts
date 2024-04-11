import { Attachments } from "./attachments.model";

export class ProjectInfo{
    constructor(res?: ProjectInfo){
        if(res){
            this.id = res.id;
            this.projectId = res.projectId;
            this.name = res.name;
            this.contractNumber =  res.contractNumber;
            this.startDate = res.startDate ? new Date(res.startDate): null;
            this.endDate = res.endDate ? new Date(res.endDate): null ;
            this.attachements = res.attachements;
        }
    }
    id?: number;
    projectId?: number;
    contractNumber?: string;
    name?: string;
    startDate?: any;
    endDate?: any;
   attachements?: Attachments[]
}