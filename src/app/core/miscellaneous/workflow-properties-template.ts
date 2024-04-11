export enum WorkFlowSignOffRule {
    Any = "Any",
    All = "All",
    None = "None"
}

export enum WorkflowAction {
    Approved = "Approved",
    Rejected = "Rejected",
    New = "New"
}


export type WorkflowUsersAssignmentByRoles = {
    role: string;
    usersSelected: any[];
};