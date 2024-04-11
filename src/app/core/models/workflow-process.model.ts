
import { FormType } from 'src/app/core/miscellaneous/global-props.template';

export class WorkflowProcess {
    description?: string;
    formId?: number;
    formType?: FormType;
    id?: number;
    initiatedByUserId?: string;
    initiationTime?: Date;
    status?: string
}