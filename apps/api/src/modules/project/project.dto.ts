import { IUserDoc } from '../user/user.interface';
import { ProjectType } from './project.interface';

export interface CreateProjectDTO {
  user: IUserDoc;      
  title: string;
  tagline?: string;
  description: string;
  category: string;
  type: ProjectType;
  items?: <IBlockDoc>;        
  tags?: Array<string>;
  image?: string;
  documentation?: string;
  createdBy?: string;   
}

export interface UpdateProjectDTO {
  title?: string;
  tagline?: string;
  description?: string;
  category?: string;
  tags?: string[];
  image?: string;
  isOpen?: boolean;
  isClosed?: boolean;
}