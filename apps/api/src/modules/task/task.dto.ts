import { IUserDoc } from '../user/user.interface';
import { TaskStatus, TaskPriority } from '../../utils/enums.util';

export interface TaskDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  workspaceId: string;
  businessId: string;
  projectId: string;
  teamId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[];
  createdBy: string;
  tags: string[];
  dueDate: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  user: IUserDoc;
  workspaceId: string;
  projectId: string;
  teamId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  createdBy: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  completedAt?: Date;
}
