export interface Task {
    id?: string;
    title: string;
    description: string;
    completed?: boolean;
    assignedBy?: string;
    assignee?: string;
    assigneeName?: string;
    createdTime?: string;
    updatedTime?: string;
    deadline?: string;
    orgId?: string;
}
  