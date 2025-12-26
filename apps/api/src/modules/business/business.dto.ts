import { IUserDoc } from '../user/user.interface';
import { 
  BusinessType, 
  VerificationType,
  ISocials,
  IBusinessRegistration,
  Iverification
} from './business.interface';

export interface CreateBusinessDTO {
  // Identity (Usually handled by the system or passed from User account)
  code?: string;
  firstName: string;
  lastName: string;
  email: string;
  user: IUserDoc; // The ObjectId of the associated User account

  // Business Details
  businessName: string;
  businessType: BusinessType;
  description?: string;
  size?: string;
  industry: string;
  tags?: string[];
  website?: string;
  socials?: ISocials[];

  // Verification & Registration
  verification?: Iverification;
  registration?: IBusinessRegistration;
  isPublic?: boolean;

  // Tracking
  createdBy?: string; // ObjectId of the creator/admin
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
  verification?: Iverification;
  registration?: IBusinessRegistration;
  isPublic?: boolean;
}

