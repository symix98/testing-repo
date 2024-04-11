export enum AttachmentType {
    UserSignature = "UserSignature",
    Document = "Document",
    Report = "Report",
    Drawing = "Drawing",
    Image = "Image",
    CompanyLogo = "CompanyLogo",
    ClientLogo = "ClientLogo"
}

export class Attachments {
    id?: number;
    fileName?: string;
    description?: string;
    type?: AttachmentType;
    data?: any;
    dataContentType?: any;
    projectInfo: any;
    projectInfoId?: any;
}