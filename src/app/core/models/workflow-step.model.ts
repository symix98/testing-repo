import { WorkflowActionUser } from 'src/app/core/models/workflow-action-user.model';

export class WorkflowStep {
    actionLabel?: string;
    actionStatus?: string;
    complete?: boolean;
    completeTime?: Date;
    dueDate?: Date;
    deadlineDate?: any;
    description?: string;
    id?: number;
    signoffRule?: string;
    stepInitiator?: string;
    triggerTime?: Date;
    workflowProcessId?: number;
    workflowActionUserDTOList?: WorkflowActionUser[];
    show?: boolean;
    workflowTemplateStepId?: number;
}

