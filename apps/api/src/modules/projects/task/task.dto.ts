import { IUserDoc } from '../../users/user/user.interface';
import { TaskPriorityType, TaskStatusType } from './task.interface';
import { IFile } from '../../../utils/interfaces.util';


export interface TaskDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  workspaceId: string;
  businessId: string;
  projectId: string;
  teamId: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
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
  status: TaskStatusType;
  priority: TaskPriorityType;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  image?: IFile | string;
  createdBy: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatusType ;
  priority?: TaskPriorityType;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  completedAt?: Date;
  image?: IFile | string;
}
