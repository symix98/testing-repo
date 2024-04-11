import { AppUsers } from 'src/app/core/models/app-users.model';

export class WorkflowActionUser {
    public id?: number;
    public actionTime?: Date;
    public approve?: boolean;
    public comment?: string;
    public actionUserId?: string;
    public workflowStepId?: number;
    public actionUser?: AppUsers;
}