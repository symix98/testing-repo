export class TransmittalRecipients {
    tRecName: string;
    tRecEmail: string;
    recComp?: string;
    recTitle?: string;
    isAckRequired?: boolean;
    isRespRequired?: boolean;
    acknolgment?: string;
    response?: string;
    ackDate?: Date;
    respDate?: Date;
    ackRequiredDate?: Date;
    respRequiredDate?: Date;
    comments?: string;
}