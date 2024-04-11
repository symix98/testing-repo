import { FormType } from "../miscellaneous/global-props.template";
import { WorkFlowSignOffRule } from "../miscellaneous/workflow-properties-template";

export class WorkflowTemplate {
    id?: number;
    sequence?: number;
    formType?: FormType;
    stepName?: string;
    actionDescription?: string;
    signOffRule?: WorkFlowSignOffRule;
    multipleActionUsers?: boolean;
    roles?: string;
    initialStatus?: string;
    successStatus?: string;
    enabled?: boolean;
}