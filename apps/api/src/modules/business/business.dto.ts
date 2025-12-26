import { IUserDoc } from '../user/user.interface';
import { 
  BusinessType, 
  ISocials,
} from './business.interface';

export interface CreateBusinessDTO {
  user: IUserDoc;
  businessName: string;
  businessType: BusinessType;
  industry: string;
  createdBy?: string;
}

export interface UpdateBusinessDTO {
  businessName?: string;
  businessType?: BusinessType;
  description?: string;
  size?: string;
  industry?: string;
  tags?: string[];
  website?: string;
  socials?: ISocials[];
  isPublic?: boolean;
}

