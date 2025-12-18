import { Model, Document, Types } from "mongoose";

export type ObjectId = Types.ObjectId;


export interface IAdminDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;

  // contact
  phoneNumber?: string;
  phoneCode?: string;
  country?: string;
  countryPhone?: string;

  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  slug?: string;

  // Staff Role & Access
  permissions?: {
    manageUsers?: boolean;
    manageOrganisations?: boolean;
    manageTalents?: boolean;
    manageContent?: boolean;
    viewLogs?: boolean;
    manageApiKeys?: boolean;
  };

  // API & Security Management
  apiKeys?: Array<{
    key: string;
    description?: string;
    createdAt: Date;
    lastUsed: Date;
  }>;

  ipWhitelist?: Array<string>;

  // Admin Actions & Moderation
  actionsTaken?: Array<{
    action: string;
    targetId: string;
    timestamp: Date;
    description: string;
  }>;

  // Relationships managed by the admin
  managedUsers?: Array<ObjectId | any>;
  managedOrganisations?: Array<ObjectId | any>;
  managedTalents?: Array<ObjectId | any>;

  // Security & Verification
  identification?: Array<string>;
  isVerified?: boolean;
  verifiedAt?: Date | null;

  //relationships
  user?: ObjectId | any;
  createdBy?: ObjectId | any;
  settings?: ObjectId | any;

  // time stamps
  createdAt: string;
  updatedAt: string;
  _version: number;
  _id: ObjectId;
  id: ObjectId | string;
}