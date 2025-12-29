import { UserType } from "../user/user.interface";    
import { IUserDoc } from "../user/user.interface"; 

export interface CreateAdminDTO {
  firstName?: string;
  lastName?: string;
  email?: string;

  phoneNumber?: string;
  phoneCode?: string;
  country?: string;
  dateOfBirth?: Date;
  gender?: string;

  userType?: UserType; 
  user: IUserDoc
  createdBy?: string;

  permissions?: {
    manageUsers: boolean;
    manageOrganisations: boolean;
    manageTalents: boolean;
    manageContent: boolean;
    viewLogs: boolean;
    manageApiKeys: boolean;
  };

  apiKeys?: Array<{
    key: string;
    description: string;
    createdAt: Date;
    lastUsed?: Date;
  }>;

  ipWhitelist?: Array<string>;

  actionsTaken?: Array<{
    action: string;
    targetId: string;
    timestamp: Date;
    description?: string;
  }>;

  managedUsers?: Array<string>;
  managedOrganisations?: Array<string>;
  managedTalents?: Array<string>;

  identification?: Array<string>;
}

export interface InviteAdminDTO {
  email: string;
}