import { FileType, UploadStatus } from "../../utils/enums.util";
import { UserType } from "../user/user.interface";
import { IUserDoc } from "../../utils/interfaces.util";

// The SocialLinks object as defined in your ITalentDoc
export interface ISocialLinks {
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  [key: string]: string | any;
}

export interface createOrganisationDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: UserType;
  banner?: string;
  logo?: string;
  description?: string;
  partners?: Array<string>;

  socialLinks?: {
    github?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
    [key: string]: string | any;
  };

  // upload data
  backgroundImage?: {
    fileName?: string;
    fileSize?: number;
    fileType?: FileType;
    mimetype?: string;
    uploadedBy?: string;
    uploadStatus?: UploadStatus;
    uploadId?: string;
    s3Key?: string;
    rawFile?: string;
  };
  // relationships
  type?: UserType
  user: IUserDoc
  users?: Array<string | any>; // org members
  evaluators?: Array<string | any>; // users that act as evaluators
  mentors?: Array<string | any>; // users that act as mentors
  createdBy: string | any; // admin who created the org
  settings?: string | any; // org settings
  hackathons?: Array<string | any>;
  projects?: Array<string | any>;
  competitions?: Array<string | any>;
}

export interface updateOrganizationDTO {
  user: IUserDoc;
  userType: UserType;
  email: string;
}


export type updateOrganisationDTO = Partial<createOrganisationDTO>;

export type updateSocialLinksDTO = Partial<ISocialLinks>;
